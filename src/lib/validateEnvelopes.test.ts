import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { validateEnvelopes } from './validateEnvelopes'

describe('validateEnvelopes', () => {
  it('returns invalid paths for envelopes with omissions', () => {
    const content = readFileSync('features/fixtures/messages-omissions.ndjson', {
      encoding: 'utf-8',
    })
    const lines = content.trim().split('\n')
    const invalidPaths = validateEnvelopes(lines)

    expect(invalidPaths).toEqual([
      'gherkinDocument.feature.children.scenario.examples',
      'testRunStarted.timestamp.nanos',
    ])
  })
})
