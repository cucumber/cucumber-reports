import type { Envelope } from '@cucumber/messages'
import * as Sentry from '@sentry/react'
import { useQuery } from '@tanstack/react-query'
import { parseEnvelopeWithReviver } from '../lib/parseEnvelopeWithReviver.ts'

export function useEnvelopes(id: string) {
  return useQuery({
    queryKey: ['envelopes', id],
    queryFn: async (): Promise<ReadonlyArray<Envelope>> => {
      const response = await fetch(`/api/reports/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch envelopes', { cause: response })
      }
      const raw = await response.text()
      const parsed = raw
        .trim()
        .split('\n')
        .map((s) => parseEnvelopeWithReviver(s))
      emitTelemetry(parsed)
      return parsed
    },
  })
}

export function emitTelemetry(parsed: ReadonlyArray<Envelope>) {
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
  } catch {
    // dont block the user in case our telemetry code or Sentry itself errors
  }
}
