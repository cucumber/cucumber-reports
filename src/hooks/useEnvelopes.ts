import { Envelope, parseEnvelope } from '@cucumber/messages'
import * as Sentry from '@sentry/react'
import { useQuery } from '@tanstack/react-query'

import { validateEnvelopes } from '../lib/validateEnvelopes'

export function useEnvelopes(id: string) {
  return useQuery({
    queryKey: ['envelopes', id],
    queryFn: async (): Promise<ReadonlyArray<Envelope>> => {
      const response = await fetch(`/api/reports/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch envelopes', { cause: response })
      }
      const raw = await response.text()
      const envelopes = raw.trim().split('\n')
      const parsed = envelopes.map((s) => parseEnvelope(s))
      emitTelemetry(envelopes, parsed)
      return parsed
    },
  })
}

export function emitTelemetry(envelopes: ReadonlyArray<string>, parsed: ReadonlyArray<Envelope>) {
  try {
    Sentry.metrics.count('envelopes_fetch', 1)
    const meta = parsed.find((e) => e.meta)?.meta
    if (meta) {
      Sentry.setTags({
        meta_os_name: meta.os.name,
        meta_os_version: meta.os.version,
        meta_runtime_name: meta.runtime.name,
        meta_runtime_version: meta.runtime.version,
        meta_implementation_name: meta.implementation.name,
        meta_implementation_version: meta.implementation.version,
      })
    }

    const invalidPaths = validateEnvelopes(envelopes)
    for (const path of invalidPaths) {
      Sentry.metrics.count('envelopes_validity', 1, { attributes: { path } })
    }
  } catch {
    // dont block the user in case our telemetry code or Sentry itself errors
  }
}
