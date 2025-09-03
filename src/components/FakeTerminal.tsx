import type { FC, PropsWithChildren } from 'react'

export const FakeTerminal: FC<
  PropsWithChildren<{
    title?: string
  }>
> = ({ children, title }) => {
  return (
    <div className="w-full relative">
      <div className="bg-slate-800 text-white p-5 shadow-lg rounded-lg">
        <div className="relative mb-2 flex">
          <div className="flex">
            <div className="h-3 w-3 bg-red-500 rounded-full" />
            <div className="ml-2 h-3 w-3 bg-yellow-300 rounded-full" />
            <div className="ml-2 h-3 w-3 bg-green-500 rounded-full" />
          </div>
          {title && (
            <span className="absolute right-0 -top-1 text-sm text-slate-400 font-mono">
              {title}
            </span>
          )}
        </div>
        <pre className="mt-4">{children}</pre>
      </div>
    </div>
  )
}
