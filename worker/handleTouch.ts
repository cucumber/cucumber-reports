import { makeReportBanner, tokenBanner } from './banner'
import type { Env } from './env.ts'
import { sign } from './signing'
import { writeResponse } from './writeResponse.ts'

export async function handleTouch(request: Request, env: Env): Promise<Response> {
  if (request.headers.get('authorization')) {
    console.warn('Received request with authorization header; rejecting it')
    return writeResponse(400, tokenBanner)
  }

  const id = crypto.randomUUID()
  const reportUrl = `${env.BASE_URL}/reports/${id}`
  const until = String(Date.now() + Number(env.UPLOAD_TTL) * 1000)
  const signature = await sign(id, until, env.SIGNING_KEY)

  const uploadUrl = new URL('/api/reports/upload', request.url)
  uploadUrl.searchParams.set('id', id)
  uploadUrl.searchParams.set('until', until)
  uploadUrl.searchParams.set('signature', signature)

  return new Response(makeReportBanner(reportUrl), {
    status: 202,
    headers: {
      'content-type': 'text/plain; charset=UTF-8',
      location: uploadUrl.toString(),
    },
  })
}
