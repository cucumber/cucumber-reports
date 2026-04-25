import { styleText as nodeStyleText } from 'node:util'

export type StyleFormat = Parameters<typeof nodeStyleText>[0]

export function styleText(format: StyleFormat, text: string): string {
  return nodeStyleText(format, text, { validateStream: false })
}
