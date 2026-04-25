import { stripVTControlCharacters } from 'node:util'

import { type Action } from '../support/Actor.mjs'
import { type TouchResult } from './types'

export const touchReport: () => Action<TouchResult> = () => {
  return async (actor) => {
    const privateToken = actor.recall('privateToken')
    const headers = new Headers()
    if (privateToken) {
      headers.set('Authorization', `Bearer ${privateToken}`)
    }
    const response = await fetch('http://localhost:5173/api/reports', { headers })
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
