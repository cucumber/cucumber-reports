import type { Envelope } from '@cucumber/messages'

export function parseEnvelopeWithReviver(raw: string): Envelope {
  return JSON.parse(raw, (key, value) => {
    if (typeof value === 'object') {
      if ((key === 'timestamp' || key === 'duration') && typeof value.seconds !== 'number') {
        value.seconds = 0
      }
      if ((key === 'timestamp' || key === 'duration') && typeof value.nanos !== 'number') {
        value.nanos = 0
      }
      if (key === 'scenario' && !value.examples) {
        value.examples = []
      }
      if (key === 'testCaseStarted' && typeof value.attempt !== 'number') {
        value.attempt = 0
      }
      if (key === 'testCaseFinished' && typeof value.willBeRetried !== 'boolean') {
        value.willBeRetried = false
      }
    }
    return value
  }) as Envelope
}
