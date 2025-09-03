import type { FC, PropsWithChildren } from 'react'

export const FakeWindow: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full">
      <div className="bg-white inverse-toggle p-5 shadow-lg rounded-lg">
        <div className="top mb-2 flex">
          <div className="h-3 w-3 bg-red-500 rounded-full" />
          <div className="ml-2 h-3 w-3 bg-yellow-300 rounded-full" />
          <div className="ml-2 h-3 w-3 bg-green-500 rounded-full" />
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
