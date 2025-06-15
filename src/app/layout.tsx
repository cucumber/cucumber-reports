import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { ReactNode } from 'react'
import { textFont } from './fonts'
import { Masthead } from '@/components/Masthead'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cucumber Reports',
}

export default function RootLayout({ children }: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${textFont.className} antialiased flex flex-col min-h-screen bg-white text-slate-800`}>
    <Masthead />
    {children}
    <Footer/>
    </body>
    <GoogleAnalytics gaId="G-22NQZFFMH7" />
    </html>
  )
}
