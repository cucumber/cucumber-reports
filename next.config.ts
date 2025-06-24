import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
}

export default withSentryConfig(
  createMDX()(nextConfig),
  {
    org: 'cucumber-i5',
    project: 'cucumber-reports',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    disableLogger: true,
  },
)