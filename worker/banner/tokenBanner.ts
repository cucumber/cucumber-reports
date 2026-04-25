import { makeBanner } from './makeBanner.ts'
import { styleText } from './styleText.ts'

export const tokenBanner = makeBanner(
  ['red'],
  [
    'Private reports are no longer supported.',
    'You can still publish anonymous (public) reports',
    'by removing the token from your configuration.',
    '',
    'See ' + styleText(['bold', 'underline', 'cyan'], 'https://reports.cucumber.io/faqs'),
  ]
)
