import type { Envelope } from '@cucumber/messages'

type KnownOmission = {
  key: string
  type: 'string' | 'number' | 'boolean' | 'array'
  fallback: unknown | (() => unknown)
}

const KNOWN_OMISSIONS: Record<string, ReadonlyArray<KnownOmission>> = {
  attachment: [{ key: 'contentEncoding', type: 'string', fallback: 'IDENTITY' }],
  background: [
    { key: 'description', type: 'string', fallback: '' },
    { key: 'name', type: 'string', fallback: '' },
    { key: 'steps', type: 'array', fallback: () => [] },
  ],
  cells: [{ key: 'value', type: 'string', fallback: '' }],
  duration: [
    { key: 'seconds', type: 'number', fallback: 0 },
    { key: 'nanos', type: 'number', fallback: 0 },
  ],
  examples: [
    { key: 'description', type: 'string', fallback: '' },
    { key: 'name', type: 'string', fallback: '' },
    { key: 'tags', type: 'array', fallback: () => [] },
  ],
  feature: [
    { key: 'description', type: 'string', fallback: '' },
    { key: 'name', type: 'string', fallback: '' },
    { key: 'tags', type: 'array', fallback: () => [] },
  ],
  gherkinDocument: [
    {
      key: 'comments',
      type: 'array',
      fallback: () => [],
    },
  ],
  javaMethod: [{ key: 'methodParameterTypes', type: 'array', fallback: () => [] }],
  pattern: [{ key: 'type', type: 'string', fallback: 'CUCUMBER_EXPRESSION' }],
  pickle: [
    {
      key: 'tags',
      type: 'array',
      fallback: () => [],
    },
  ],
  rule: [
    { key: 'description', type: 'string', fallback: '' },
    { key: 'name', type: 'string', fallback: '' },
    { key: 'tags', type: 'array', fallback: () => [] },
  ],
  scenario: [
    { key: 'description', type: 'string', fallback: '' },
    { key: 'name', type: 'string', fallback: '' },
    {
      key: 'tags',
      type: 'array',
      fallback: () => [],
    },
    {
      key: 'examples',
      type: 'array',
      fallback: () => [],
    },
  ],
  stepMatchArgumentsLists: [
    {
      key: 'stepMatchArguments',
      type: 'array',
      fallback: () => [],
    },
  ],
  testCaseFinished: [{ key: 'willBeRetried', type: 'boolean', fallback: false }],
  testCaseStarted: [{ key: 'attempt', type: 'number', fallback: 0 }],
  timestamp: [
    { key: 'seconds', type: 'number', fallback: 0 },
    { key: 'nanos', type: 'number', fallback: 0 },
  ],
}

function matchesType(type: KnownOmission['type'], value: unknown): boolean {
  return type === 'array' ? Array.isArray(value) : typeof value === type
}

// biome-ignore lint/suspicious/noExplicitAny: reviver must handle any value
function isPlainObject(value: any) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// biome-ignore lint/suspicious/noExplicitAny: reviver must handle any value
function reviver(key: string, value: any) {
  if (isPlainObject(value)) {
    // check known omissions within this object and apply fallbacks
    for (const omission of KNOWN_OMISSIONS[key] ?? []) {
      if (!matchesType(omission.type, value[omission.key])) {
        value[omission.key] =
          typeof omission.fallback === 'function' ? omission.fallback() : omission.fallback
      }
    }
    // do the same logic for items in arrays
    for (const [childKey, childValue] of Object.entries(value)) {
      if (Array.isArray(childValue)) {
        value[childKey] = childValue.map((childItem) => reviver(childKey, childItem))
      }
    }
  }
  return value
}

export function parseEnvelopeWithReviver(raw: string): Envelope {
  return JSON.parse(raw, reviver) as Envelope
}
