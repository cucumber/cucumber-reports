import { stripVTControlCharacters, styleText } from 'node:util'

import { AwsClient } from 'aws4fetch'

interface Env {
  BASE_URL: string
  R2_ENDPOINT: string
  R2_BUCKET_NAME: string
  R2_ACCESS_KEY_ID: string
  R2_SECRET_ACCESS_KEY: string
}

type StyleFormat = Parameters<typeof styleText>[0]

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.headers.get('authorization')) {
      console.warn('Received request with authorization header; rejecting it')
      return new Response(makeTokenBanner(), {
        status: 400,
        headers: {
          'content-type': 'text/plain; charset=UTF-8',
        },
      })
    }

    const id = crypto.randomUUID()
    const reportUrl = `${env.BASE_URL}/reports/${id}`

    // generate presigned URL only if credentials are available (production)
    let putUrl: string | undefined
    if (env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY) {
      const aws = new AwsClient({
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        service: 's3',
      })

      const url = new URL(`${env.R2_ENDPOINT}/${env.R2_BUCKET_NAME}/${id}`)
      url.searchParams.set('X-Amz-Expires', '3600')

      const signedRequest = await aws.sign(url.toString(), {
        method: 'PUT',
        aws: { signQuery: true },
      })

      putUrl = signedRequest.url
    }

    const headers: Record<string, string> = {
      'content-type': 'text/plain; charset=UTF-8',
    }
    if (putUrl) {
      headers['location'] = putUrl
    }

    return new Response(makeReportBanner(reportUrl), {
      status: 202,
      headers,
    })
  },
}

export function makeReportBanner(reportUrl: string): string {
  return makeBanner(
    ['bold', 'green'],
    [
      'View your Cucumber Report at:',
      style(['bold', 'underline', 'cyan'], reportUrl),
      '',
      style('bold', 'This report will self-destruct in 24h.'),
    ]
  )
}

export function makeTokenBanner(): string {
  return makeBanner(
    ['red'],
    [
      'Private reports are no longer supported.',
      'You can still publish anonymous (public) reports',
      'by removing the token from your configuration.',
      '',
      'See ' + style(['bold', 'underline', 'cyan'], 'https://reports.cucumber.io/faqs'),
    ]
  )
}

function makeBanner(format: StyleFormat, lines: string[]): string {
  const border = (value: string) => style(format, value)
  const maxLength = lines
    .map((line) => plainLength(line))
    .sort((a, b) => a - b)
    .at(-1)!

  return [
    border('┌' + repeat('─', maxLength + 2) + '┐'),
    ...lines.map((line) => {
      return `${border('│')} ${line}${repeat(' ', maxLength - plainLength(line))} ${border('│')}`
    }),
    border('└' + repeat('─', maxLength + 2) + '┘'),
    '',
  ].join('\n')
}

function style(format: StyleFormat, text: string): string {
  return styleText(format, text, { validateStream: false })
}

function plainLength(line: string): string['length'] {
  return stripVTControlCharacters(line).length
}

function repeat(char: string, length: number): string {
  return new Array(length).fill(char).join('')
}
