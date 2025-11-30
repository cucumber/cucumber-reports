import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

declare global {
  interface Window {
    ethicalads?: {
      reload: () => void
      load: () => void
      wait: Promise<unknown>
    }
  }
}

function AdInternal() {
  useEffect(() => {
    window.ethicalads?.reload()
  }, [])

  return (
    <div
      data-ea-publisher="cucumberio"
      data-ea-type="text"
    />
  )
}

export function Ad() {
  return (
    <ErrorBoundary fallback={null}>
      <AdInternal />
    </ErrorBoundary>
  )
}
