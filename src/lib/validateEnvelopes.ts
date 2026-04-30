import envelopeSchema from '@cucumber/messages/schema' with { type: 'json' }
import { registerSchema, validate } from '@hyperjump/json-schema/draft-2020-12'
import { BASIC } from '@hyperjump/json-schema/experimental'

registerSchema(envelopeSchema)
const validator = await validate(envelopeSchema.$id)

export function validateEnvelopes(envelopes: ReadonlyArray<string>): ReadonlyArray<string> {
  const invalidPaths = new Set<string>()
  for (const envelope of envelopes) {
    const parsed = JSON.parse(envelope)
    const output = validator(parsed, BASIC)
    if (!output.valid && output.errors) {
      for (const error of output.errors) {
        const path = makePath(error.instanceLocation)
        if (path) {
          invalidPaths.add(path)
        }
      }
    }
  }
  return [...invalidPaths]
}

function makePath(pointer: string): string {
  return pointer
    .replace(/^#/, '')
    .replace(/^\//, '')
    .split('/')
    .filter((seg) => seg && !/^\d+$/.test(seg))
    .map((seg) => seg.replace(/~1/g, '/').replace(/~0/g, '~'))
    .join('.')
}
