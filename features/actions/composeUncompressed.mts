import type { RequestComposer } from './types.ts'

export const composeUncompressed: RequestComposer = async (url, content) => {
  return new Request(url, {
    method: 'PUT',
    body: content,
  })
}
