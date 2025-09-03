import type { FC } from 'react'
import { Link } from 'react-router-dom'

export const Footer: FC = () => {
  return (
    <footer className="p-5 text-sm text-center bg-slate-50">
      Copyright © 2025 The Cucumber Open Source Project
      <br />
      <Link className="underline" to="/terms">
        Terms & Privacy
      </Link>
    </footer>
  )
}
