import { Buffer } from 'node:buffer'

import { importKey } from './importKey.ts'

export async function sign(id: string, until: string, key: string): Promise<string> {
  const cryptoKey = await importKey(key)
  const data = new TextEncoder().encode(`${id}|${until}`)
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data)
  return Buffer.from(signature).toString('hex')
}
