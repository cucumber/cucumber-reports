import { PutObjectCommand, S3 } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'
import { stripVTControlCharacters, styleText } from 'node:util'

const s3 = new S3({
  forcePathStyle: true,
  endpoint: process.env.APP_AWS_ENDPOINT,
})

export const handler = async (event) => {
  if (event.headers['authorization']) {
    return {
      headers: {
        'content-type': 'text/plain; charset=UTF-8',
      },
      statusCode: 400,
      body: makeTokenBanner(),
    };
  }

  const id = randomUUID()

  const putUrl = await getSignedUrl(s3, new PutObjectCommand({
    Bucket: process.env.APP_BUCKET_NAME ?? 'cucumber-reports-anonymous-envelopes',
    Key: id,
  }), { expiresIn: 3600 })

  const reportUrl = `${process.env.APP_BASE_URL}/reports/${id}`

  return {
    headers: {
      'location': putUrl,
      'content-type': 'text/plain; charset=UTF-8',
    },
    statusCode: 202,
    body: makeReportBanner(reportUrl),
  };
};

export function makeReportBanner(reportUrl) {
  return makeBanner(['bold', 'green'], [
    'View your Cucumber Report at:',
    style(['bold', 'underline', 'cyan'], reportUrl),
    '',
    style('bold', 'This report will self-destruct in 24h.'),
  ])
}

export function makeTokenBanner() {
  return makeBanner(['red'], [
    'Private reports are no longer supported.',
    'You can still publish anonymous (public) reports',
    'by removing the token from your configuration.',
    '',
    'See ' + style(['bold', 'underline', 'cyan'], 'https://reports.cucumber.io/faqs'),
  ])
}

function makeBanner(format, lines) {
  const horizontal = style(format, '─')
  const vertical = style(format, '│')
  const topLeft = style(format, '┌')
  const topRight = style(format, '┐')
  const bottomLeft = style(format, '└')
  const bottomRight = style(format, '┘')
  const maxLength = lines
    .map(line => plainLength(line))
    .sort()
    .at(-1)

  return [
    topLeft + repeat(horizontal, maxLength + 2) + topRight,
    ...lines.map(line => {
      return `${vertical} ${line}${repeat(' ', maxLength - plainLength(line))} ${vertical}`
    }),
    bottomLeft + repeat(horizontal, maxLength + 2) + bottomRight,
    ''
  ].join('\n')
}

function style(format, text) {
  return styleText(format, text, { validateStream: false })
}

function plainLength(line) {
  return stripVTControlCharacters(line).length
}

function repeat(char, length) {
  return new Array(length).fill(char).join('')
}
