export function writeResponse(status: number, text: string): Response {
  return new Response(text, {
    status,
    headers: { 'content-type': 'text/plain; charset=UTF-8' },
  })
}
