import { stripVTControlCharacters } from 'node:util'

import type { Action } from '../support/Actor.mjs'
import type { TouchResult } from './types'

export const touchReport: () => Action<TouchResult> = () => {
  return async (actor) => {
    const privateToken = actor.recall('privateToken')
    const headers = new Headers()
    headers.set('Accept', actor.world.accepts)
    if (privateToken) {
      headers.set('Authorization', `Bearer ${privateToken}`)
    }
    const response = await fetch('http://localhost:5173/api/reports', { headers })

    if (actor.world.accepts.includes('application/json')) {
      const body = (await response.json()) as { banner: string; url?: string }
      const banner = stripVTControlCharacters(body.banner)
      if (response.ok) {
        return {
          success: true,
          banner,
          url: body.url as string,
          uploadUrl: response.headers.get('location') as string,
        }
      }
      return { success: false, banner }
    }

    const banner = stripVTControlCharacters(await response.text())
    if (response.ok) {
      const url = banner.split(' ').find((part) => part.startsWith('http')) as string
      const uploadUrl = response.headers.get('location') as string

      return {
        success: true,
        banner,
        url,
        uploadUrl,
      }
    }

    return {
      success: false,
      banner,
    }
  }
}
