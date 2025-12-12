import './index.css'

import * as Sentry from '@sentry/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'

Sentry.init({
  dsn: 'https://c3ae677edf55795aca256db1bb0e7aa3@o4509553056546816.ingest.us.sentry.io/4509553058250752',
  enableLogs: true
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
  </StrictMode>,
)
