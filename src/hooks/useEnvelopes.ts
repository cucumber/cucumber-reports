import { Envelope, parseEnvelope } from '@cucumber/messages'
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
      return raw
        .trim()
        .split('\n')
        .map((s) => parseEnvelope(s))
    },
  })
}
