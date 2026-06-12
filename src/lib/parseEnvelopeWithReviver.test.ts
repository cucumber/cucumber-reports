import type { Envelope } from '@cucumber/messages'
import { describe, expect, it } from 'vitest'
import { parseEnvelopeWithReviver } from './parseEnvelopeWithReviver'

describe('parseEnvelopeWithReviver', () => {
  it('defaults omitted fields in timestamps', () => {
    const raw = `{"testRunStarted":{"id":"123","timestamp":{}}}`

    expect(parseEnvelopeWithReviver(raw)).toEqual({
      testRunStarted: {
        id: '123',
        timestamp: {
          seconds: 0,
          nanos: 0,
        },
      },
    } satisfies Envelope)
  })
})
