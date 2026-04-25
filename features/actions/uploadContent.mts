import { readFileSync } from 'node:fs'
import path from 'node:path'

import { type Action } from '../support/Actor.mjs'
import { type RequestComposer, type UploadResult } from './types'

export const uploadContent: (
  fixture: string,
  requestComposer: RequestComposer,
  uploadUrl: string
) => Action<UploadResult> = (fixture, requestComposer, uploadUrl) => {
  return async () => {
    const envelopes = readFileSync(path.join(import.meta.dirname, '..', 'fixtures', fixture), {
      encoding: 'utf-8',
    })
    const request = await requestComposer(uploadUrl, envelopes)
    const response = await fetch(request)
    return {
      success: response.ok,
      status: response.status,
    }
  }
}
