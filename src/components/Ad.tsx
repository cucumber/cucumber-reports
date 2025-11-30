import { useEffect } from 'react'

declare global {
  interface Window {
    ethicalads?: {
      reload: () => void
      load: () => void
      wait: Promise<unknown>
    }
  }
}

export function Ad() {
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
