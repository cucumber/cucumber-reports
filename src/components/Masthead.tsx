import { FC } from 'react'
import logo from '@/app/icon.svg'
import Image from 'next/image'
import Link from 'next/link'

export const Masthead: FC = () => {
  return (
    <nav className="sticky top-0 left-0 right-0 z-10 p-3 bg-white shadow-sm">
      <div className="flex items-center justify-between max-w-7xl px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image alt="" src={logo} width="30" height="30" />
          <b>Cucumber Reports</b>
        </Link>
        <span className="flex items-center gap-2 text-slate-600">
        <svg className="" width="16" height="16" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
          {/*Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.*/}
          <path
            d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z" />
        </svg>
        <a
          className="text-slate-600 hover:underline"
          href="https://cucumber.io"
          target="_blank"
        >
        cucumber.io
      </a>
      </span>
      </div>
    </nav>
  )
}