import { Buffer } from 'node:buffer'

import { importKey } from './importKey.ts'

export async function verify(
  id: string,
  until: string,
  signature: string,
  key: string
): Promise<boolean> {
  const cryptoKey = await importKey(key)
  const data = new TextEncoder().encode(`${id}|${until}`)
  const sigBytes = Buffer.from(signature, 'hex')
  return crypto.subtle.verify('HMAC', cryptoKey, sigBytes, data)
}
