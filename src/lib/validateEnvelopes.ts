import envelopeSchema from '@cucumber/messages/schema'
import Ajv2020, { type ErrorObject } from 'ajv/dist/2020'

const ajv = new Ajv2020({ allErrors: true, strict: false })
const validate = ajv.compile(envelopeSchema)

export function validateEnvelopes(envelopes: ReadonlyArray<string>): ReadonlyArray<string> {
  const invalidPaths = new Set<string>()
  for (const envelope of envelopes) {
    const parsed = JSON.parse(envelope)
    const valid = validate(parsed)
    if (!valid && validate.errors) {
      for (const error of validate.errors) {
        const path = buildErrorPath(error)
        if (path) {
          invalidPaths.add(path)
        }
      }
    }
  }
  return [...invalidPaths]
}

function buildErrorPath(error: ErrorObject): string {
  let path = error.instancePath
  // for "required" errors, append the missing property name
  if (error.params?.missingProperty) {
    path = `${path}/${error.params.missingProperty}`
  }
  return path
    .replace(/^\//, '') // remove leading slash
    .replace(/\/\d+\//g, '/') // remove array indexes like /0/
    .replace(/\/\d+$/, '') // remove trailing array index
    .replace(/\//g, '.') // replace slash separator with period
}
