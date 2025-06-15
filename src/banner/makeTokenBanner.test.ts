import { describe, expect, it } from 'vitest'
import { stripVTControlCharacters } from 'node:util'
import { makeTokenBanner } from './makeTokenBanner'

describe('makeTokenBanner', () => {
  it('returns a banner with a rejection message', () => {
    expect(stripVTControlCharacters(makeTokenBanner())).toMatchInlineSnapshot(`
      "┌──────────────────────────────────────────────────┐
      │ Private reports are no longer supported.         │
      │ You can still publish anonymous (public) reports │
      │ by removing the token from your configuration.   │
      │ See https://reports.cucumber.io/faqs             │
      └──────────────────────────────────────────────────┘
      "
    `)
  })
})