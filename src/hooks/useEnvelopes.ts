import { Envelope, parseEnvelope } from '@cucumber/messages'
import * as Sentry from '@sentry/react'
import { useQuery } from '@tanstack/react-query'

export function useEnvelopes(id: string) {
  return useQuery({
    queryKey: ['envelopes', id],
    queryFn: async (): Promise<ReadonlyArray<Envelope>> => {
      const response = await fetch(import.meta.env.VITE_MESSAGES_URL_TEMPLATE.replace('{id}', id))
      if (!response.ok) {
        throw new Error('Failed to fetch envelopes', { cause: response })
      }
      const raw = await response.text()
      const envelopes = raw
        .trim()
        .split('\n')
        .map((s) => parseEnvelope(s))
      setTags(response, envelopes)
      return envelopes
    },
  })
}

export function setTags(response: Response, envelopes: ReadonlyArray<Envelope>) {
  try {
    Sentry.metrics.count('envelopes_fetch', 1)
    Sentry.setTags({
      envelopes_compression:
        response.headers.get('Content-Encoding') == 'gzip' ? 'compressed' : 'uncompressed',
    })
    const meta = envelopes.find((e) => e.meta)?.meta
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
    // dont block the user in case Sentry itself errors
  }
}
