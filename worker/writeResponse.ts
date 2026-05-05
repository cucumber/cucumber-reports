import type { JsonObject } from 'type-fest'

export function writeResponse(
  status: number,
  body: string | JsonObject,
  additionalHeaders: Record<string, string> = {}
): Response {
  const contentType = typeof body === 'string' ? 'text/plain' : 'application/json'
  const text = typeof body === 'string' ? body : JSON.stringify(body)
  return new Response(text, {
    status,
    headers: {
      ...additionalHeaders,
      'content-type': `${contentType}; charset=UTF-8`,
    },
  })
}
