import assert from 'node:assert'
import { stripVTControlCharacters } from 'node:util'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { Action } from '../support/Actor.mjs'
import { PublishResult } from './types'

export const publishReport: (privateToken?: string) => Action<PublishResult> = (privateToken) => {
  return async () => {
    const headers = new Headers()
    if (privateToken) {
      headers.set('Authorization', `Bearer ${privateToken}`)
    }
    const getResponse = await fetch('http://localhost:3000/api/reports', { headers })

    const banner = stripVTControlCharacters(await getResponse.text())
    const url = banner.split(' ').find(part => part.startsWith('http'))

    if (getResponse.ok && url) {
      const putUrl = getResponse.headers.get('Location') as string
      const envelopes = readFileSync(path.join(import.meta.dirname, '..', 'fixtures', 'messages-valid.ndjson'), { encoding: 'utf-8' })
      const putResponse = await fetch(putUrl, {
        method: 'PUT',
        body: envelopes,
      })
      assert.ok(putResponse.ok)
    }

    return {
      success: getResponse.ok,
      banner,
      url
    }
  }
}