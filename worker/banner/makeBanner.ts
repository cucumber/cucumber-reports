import { stripVTControlCharacters } from 'node:util'

import { type StyleFormat, styleText } from './styleText.ts'

export function makeBanner(format: StyleFormat, lines: string[]): string {
  const border = (value: string) => styleText(format, value)
  const maxLength = Math.max(...lines.map(plainLength))

  return [
    border('┌' + '─'.repeat(maxLength + 2) + '┐'),
    ...lines.map((line) => {
      return `${border('│')} ${line}${' '.repeat(maxLength - plainLength(line))} ${border('│')}`
    }),
    border('└' + '─'.repeat(maxLength + 2) + '┘'),
    '',
  ].join('\n')
}

function plainLength(line: string): number {
  return stripVTControlCharacters(line).length
}
