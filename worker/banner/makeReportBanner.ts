import { makeBanner } from './makeBanner.ts'
import { styleText } from './styleText.ts'

let template: string | undefined
let placeholder: string | undefined

export function makeReportBanner(reportUrl: string): string {
  if (template === undefined || placeholder === undefined) {
    placeholder = '_'.repeat(reportUrl.length)
    template = makeBanner(
      ['bold', 'green'],
      [
        'View your Cucumber Report at:',
        styleText(['bold', 'underline', 'cyan'], placeholder),
        '',
        styleText('bold', 'This report will self-destruct in 24h.'),
      ]
    )
  }
  return template.replace(placeholder, reportUrl)
}
