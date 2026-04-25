import { gzipSync } from 'node:zlib'

import type { RequestComposer } from './types.ts'

export const composeGzipped: (type: string, encoding: string) => RequestComposer = (
  type,
  encoding
) => {
  return async (url, content) => {
    const headers: Record<string, string> = {}
    if (type) {
      headers['Content-Type'] = type
    }
    if (encoding) {
      headers['Content-Encoding'] = encoding
    }
    return new Request(url, {
      method: 'PUT',
      headers,
      body: gzipSync(content),
    })
  }
}
