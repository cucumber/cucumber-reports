import type { RequestComposer } from './types.ts'

export const composeUncompressed: RequestComposer = (content) => {
  return {
    method: 'PUT',
    body: content,
  }
}
