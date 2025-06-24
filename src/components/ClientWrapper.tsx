'use client'

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, PropsWithChildren } from 'react'
import { Envelope } from '@cucumber/messages'
import * as Sentry from '@sentry/nextjs'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: (data, query) => {
      if (query.meta?.envelopes) {
        const envelopes = data as ReadonlyArray<Envelope>
        const meta = envelopes?.find(e => e.meta)?.meta
        if (meta) {
          Sentry.setTag('meta_os_name', meta.os.name)
          Sentry.setTag('meta_os_version', meta.os.version)
          Sentry.setTag('meta_runtime_name', meta.runtime.name)
          Sentry.setTag('meta_runtime_version', meta.runtime.version)
          Sentry.setTag('meta_implementation_name', meta.implementation.name)
          Sentry.setTag('meta_implementation_version', meta.implementation.version)
        }
      }
    },
  }),
})

export const ClientWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}