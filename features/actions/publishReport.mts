import { readFileSync } from 'node:fs'
import path from 'node:path'
import { stripVTControlCharacters } from 'node:util'

import { type Action } from '../support/Actor.mjs'
import { putR2Object } from '../support/miniflare.mts'
import { type PublishResult, type RequestComposer } from './types'

export const publishReport: (
  fixture: string,
  requestComposer: RequestComposer,
  privateToken?: string
) => Action<PublishResult> = (fixture, _requestComposer, privateToken) => {
  return async () => {
    const headers = new Headers()
    if (privateToken) {
      headers.set('Authorization', `Bearer ${privateToken}`)
    }
    const getResponse = await fetch('http://localhost:8787', { headers })

    const banner = stripVTControlCharacters(await getResponse.text())
    const url = banner.split(' ').find((part) => part.startsWith('http'))

    if (getResponse.ok && url) {
      // extract report ID from the URL (e.g., http://localhost:5173/reports/{id})
      const id = url.split('/').at(-1)
      if (id) {
        const envelopes = readFileSync(path.join(import.meta.dirname, '..', 'fixtures', fixture), {
          encoding: 'utf-8',
        })
        // use Miniflare to put data directly into R2
        await putR2Object(id, envelopes)
      }
    }

    return {
      success: getResponse.ok,
      banner,
      url,
    }
  }
}
