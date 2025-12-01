import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

declare global {
  interface Window {
    ethicalads?: {
      reload: () => void
    }
  }
}

function AdInternal() {
  useEffect(() => {
    window.ethicalads?.reload()
  }, [])

  return <div className="horizontal bordered" data-ea-publisher="cucumberio" data-ea-type="image" />
}

export function Ad() {
  return (
    <ErrorBoundary fallback={null}>
      <AdInternal />
    </ErrorBoundary>
  )
}
