import { stripVTControlCharacters } from 'node:util'

import { describe, expect, it } from 'vitest'

import { makeReportBanner } from './makeReportBanner.ts'

describe('makeReportBanner', () => {
  it('returns a banner with the report URL', () => {
    expect(
      stripVTControlCharacters(
        makeReportBanner('https://reports.cucumber.io/report/f5dd0aa8-95e0-4b74-9a91-000516df94ff')
      )
    ).toMatchInlineSnapshot(`
        "┌─────────────────────────────────────────────────────────────────────────┐
        │ View your Cucumber Report at:                                           │
        │ https://reports.cucumber.io/report/f5dd0aa8-95e0-4b74-9a91-000516df94ff │
        │                                                                         │
        │ This report will self-destruct in 24h.                                  │
        └─────────────────────────────────────────────────────────────────────────┘
        "
      `)
  })
})
