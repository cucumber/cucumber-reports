import { describe, expect, it } from 'vitest'
import { makeReportBanner, makeTokenBanner } from './index.mjs'
import { stripVTControlCharacters } from 'node:util'

describe('touch function', () => {
  describe('makeReportBanner', () => {
    it('returns a banner with the report URL', () => {
      expect(stripVTControlCharacters(makeReportBanner('https://reports.cucumber.io/report/123'))).toMatchInlineSnapshot(`
        "┌────────────────────────────────────────┐
        │ View your Cucumber Report at:          │
        │ https://reports.cucumber.io/report/123 │
        │                                        │
        │ This report will self-destruct in 24h. │
        └────────────────────────────────────────┘
        "
    `)
    })
  })

  describe('makeTokenBanner', () => {
    it('returns a banner with a rejection message', () => {
      expect(stripVTControlCharacters(makeTokenBanner())).toMatchInlineSnapshot(`
        "┌──────────────────────────────────────────────────┐
        │ Private reports are no longer supported.         │
        │ You can still publish anonymous (public) reports │
        │ by removing the token from your configuration.   │
        │                                                  │
        │ See https://reports.cucumber.io/faqs             │
        └──────────────────────────────────────────────────┘
        "
    `)
    })
  })
})