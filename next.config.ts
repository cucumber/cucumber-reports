import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true
}

export default createMDX({})(nextConfig)
