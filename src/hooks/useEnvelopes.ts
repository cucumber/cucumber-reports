import { useQuery } from '@tanstack/react-query'
import { Envelope, parseEnvelope } from '@cucumber/messages'

export function useEnvelopes(id: string, getUrl: string) {
  return useQuery({
    queryKey: ['envelopes', id],
    queryFn: async (): Promise<ReadonlyArray<Envelope>> => {
      const response = await fetch(getUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch envelopes', { cause: response })
      }
      const raw = await response.text()
      return raw.trim().split('\n').map(s => parseEnvelope(s))
    },
    meta: {
      envelopes: true
    }
  })
}