import { gzipSync } from 'node:zlib'
import type { RequestComposer } from './types.ts'

export const composeGzipped: RequestComposer = (content) => {
  return {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/jsonl',
      'Content-Encoding': 'gzip',
    },
    body: gzipSync(content),
  }
}
