import type { Env } from './env.ts'
import { verify } from './signing'
import { writeResponse } from './writeResponse.ts'

export async function handleUpload(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const until = url.searchParams.get('until')
  const signature = url.searchParams.get('signature')

  if (!id || !until || !signature) {
    return writeResponse(400, 'Missing required query parameters')
  }

  /*
  verify the signature before checking expiry, so a tampered until
  value is caught here rather than treated as a real expiry decision
   */
  const valid = await verify(id, until, signature, env.SIGNING_KEY)
  if (!valid) {
    return writeResponse(403, 'Invalid signature')
  }

  if (Number(until) <= Date.now()) {
    return writeResponse(410, 'Upload URL has expired')
  }

  await env.REPORTS_BUCKET.put(id, request.body, {
    httpMetadata: {
      contentType: request.headers.get('content-type') ?? undefined,
      contentEncoding: request.headers.get('content-encoding') ?? undefined,
    },
  })

  return new Response(undefined, { status: 200 })
}
