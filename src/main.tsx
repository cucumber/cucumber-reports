import './index.css'

import type { Envelope } from '@cucumber/messages'
import * as Sentry from '@sentry/react'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'

Sentry.init({
  dsn: 'https://c3ae677edf55795aca256db1bb0e7aa3@o4509553056546816.ingest.us.sentry.io/4509553058250752',
})

ReactGA.initialize('G-22NQZFFMH7')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onSuccess: (data: unknown) => {
      const envelopes = data as ReadonlyArray<Envelope>
      const meta = envelopes?.find((e) => e.meta)?.meta
      if (meta) {
        Sentry.setTag('meta_os_name', meta.os.name)
        Sentry.setTag('meta_os_version', meta.os.version)
        Sentry.setTag('meta_runtime_name', meta.runtime.name)
        Sentry.setTag('meta_runtime_version', meta.runtime.version)
        Sentry.setTag('meta_implementation_name', meta.implementation.name)
        Sentry.setTag('meta_implementation_version', meta.implementation.version)
      }
    },
  }),
})

createRoot(document.getElementById('root')!, {
  onCaughtError: Sentry.reactErrorHandler(),
  onUncaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
