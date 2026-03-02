import { stripVTControlCharacters, styleText } from 'node:util'

import { AwsClient } from 'aws4fetch'

interface Env {
  REPORTS_BUCKET: R2Bucket
  BASE_URL: string
  ALLOWED_ORIGIN: string
  R2_ENDPOINT: string
  R2_BUCKET_NAME: string
  R2_ACCESS_KEY_ID: string
  R2_SECRET_ACCESS_KEY: string
}

type StyleFormat = Parameters<typeof styleText>[0]

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // route: GET /api/reports - create new report (touch)
    if (path === '/api/reports' && request.method === 'GET') {
      return handleTouch(request, env)
    }

    // route: GET|DELETE /api/reports/{id} - crud operations
    const match = path.match(/^\/api\/reports\/([a-f0-9-]+)$/)
    if (match) {
      const id = match[1]
      return handleCrud(request, env, id)
    }

    return new Response('Not found', { status: 404 })
  },
}

async function handleTouch(request: Request, env: Env): Promise<Response> {
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

    const r2Url = new URL(`${env.R2_ENDPOINT}/${env.R2_BUCKET_NAME}/${id}`)
    r2Url.searchParams.set('X-Amz-Expires', '3600')

    const signedRequest = await aws.sign(r2Url.toString(), {
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
}

async function handleCrud(request: Request, env: Env, id: string): Promise<Response> {
  const corsHeaders = {
    'access-control-allow-origin': env.ALLOWED_ORIGIN,
    'access-control-allow-methods': 'GET, DELETE, OPTIONS',
    'access-control-allow-headers': '*',
  }

  if (request.method === 'OPTIONS') {
    return new Response(undefined, { headers: corsHeaders })
  }

  const object = await env.REPORTS_BUCKET.head(id)
  if (!object) {
    return new Response('No report found with id ' + id, {
      status: 404,
      headers: {
        ...corsHeaders,
        'content-type': 'text/plain; charset=UTF-8',
      },
    })
  }

  switch (request.method) {
    case 'GET': {
      const data = await env.REPORTS_BUCKET.get(id)
      if (!data) {
        return new Response('No report found with id ' + id, {
          status: 404,
          headers: {
            ...corsHeaders,
            'content-type': 'text/plain; charset=UTF-8',
          },
        })
      }
      const responseHeaders: Record<string, string> = {
        ...corsHeaders,
        'content-type': data.httpMetadata?.contentType ?? 'application/octet-stream',
      }
      const responseInit: ResponseInit & { encodeBody?: 'auto' | 'manual' } = {
        status: 200,
        headers: responseHeaders,
      }
      if (data.httpMetadata?.contentEncoding) {
        responseHeaders['content-encoding'] = data.httpMetadata.contentEncoding
        // prevent double-compression of pre-compressed content
        responseInit.encodeBody = 'manual'
      }
      return new Response(data.body, responseInit)
    }
    case 'DELETE': {
      await env.REPORTS_BUCKET.delete(id)
      return new Response(undefined, {
        status: 200,
        headers: corsHeaders,
      })
    }
    default: {
      return new Response('Only GET and DELETE are supported', {
        status: 405,
        headers: {
          ...corsHeaders,
          'content-type': 'text/plain; charset=UTF-8',
        },
      })
    }
  }
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
