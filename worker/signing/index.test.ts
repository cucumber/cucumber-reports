import { describe, expect, it } from 'vitest'

import { sign } from './sign.ts'
import { verify } from './verify.ts'

const key = 'test-signing-key'
const id = 'f5dd0aa8-95e0-4b74-9a91-000516df94ff'
const until = '1745000000000'

describe('signing', () => {
  it('round-trips for matching id, until and key', async () => {
    const signature = await sign(id, until, key)
    expect(await verify(id, until, signature, key)).toBe(true)
  })

  it('produces the same signature for the same inputs', async () => {
    expect(await sign(id, until, key)).toBe(await sign(id, until, key))
  })

  it('rejects a tampered id', async () => {
    const signature = await sign(id, until, key)
    const otherId = 'aaaaaaaa-95e0-4b74-9a91-000516df94ff'
    expect(await verify(otherId, until, signature, key)).toBe(false)
  })

  it('rejects a tampered until', async () => {
    const signature = await sign(id, until, key)
    const laterUntil = String(Number(until) + 1)
    expect(await verify(id, laterUntil, signature, key)).toBe(false)
  })

  it('rejects a tampered signature', async () => {
    const signature = await sign(id, until, key)
    const tampered = signature.replace(/.$/, (c) => (c === '0' ? '1' : '0'))
    expect(await verify(id, until, tampered, key)).toBe(false)
  })

  it('rejects a signature produced with a different key', async () => {
    const signature = await sign(id, until, 'a-different-key')
    expect(await verify(id, until, signature, key)).toBe(false)
  })

  it('rejects a non-hex signature without throwing', async () => {
    expect(await verify(id, until, 'not-hex', key)).toBe(false)
  })
})
