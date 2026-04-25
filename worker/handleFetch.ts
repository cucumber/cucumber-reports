import type { R2ObjectBody } from '@cloudflare/workers-types'

import type { Env } from './env.ts'
import { writeResponse } from './writeResponse.ts'

export async function handleFetch(env: Env, id: string): Promise<Response> {
  const data = await env.REPORTS_BUCKET.get(id)
  if (!data) {
    return writeResponse(404, 'No report found with id ' + id)
  }

  /*
  If the content is compressed at rest, decompress it on the way out
  of this function, otherwise it may end up double-compressed.
   */
  let body: ReadableStream = data.body
  if (isCompressed(data)) {
    body = body.pipeThrough(new DecompressionStream('gzip'))
  }

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'application/x.cucumber.messages+jsonl',
    },
  })
}

function isCompressed(data: R2ObjectBody) {
  return (
    data.httpMetadata?.contentEncoding === 'gzip' ||
    data.httpMetadata?.contentType === 'application/gzip'
  )
}
