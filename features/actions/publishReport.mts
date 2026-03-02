import { execSync } from 'node:child_process'
import path from 'node:path'
import { stripVTControlCharacters } from 'node:util'

import { type Action } from '../support/Actor.mjs'
import { type PublishResult } from './types'

export const publishReport: (
  fixture: string,
  contentEncoding: string | undefined,
  privateToken?: string
) => Action<PublishResult> = (fixture, contentEncoding, privateToken) => {
  return async () => {
    const headers = new Headers()
    if (privateToken) {
      headers.set('Authorization', `Bearer ${privateToken}`)
    }
    const getResponse = await fetch('http://localhost:8787/api/reports', { headers })

    const banner = stripVTControlCharacters(await getResponse.text())
    const url = banner.split(' ').find((part) => part.startsWith('http'))

    if (getResponse.ok && url) {
      const id = url.split('/').at(-1)
      if (id) {
        const fixturePath = path.join(import.meta.dirname, '..', 'fixtures', fixture)

        let cmd = `npx wrangler r2 object put cucumber-reports-anonymous-envelopes/${id} --file=${fixturePath} --local`
        if (contentEncoding) {
          cmd += ` --content-encoding=${contentEncoding}`
        }

        execSync(cmd, { stdio: 'pipe' })
      }
    }

    return {
      success: getResponse.ok,
      banner,
      url,
    }
  }
}
