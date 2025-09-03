import { Page } from 'puppeteer'
import { type Action } from '../support/Actor.mjs'

export const canSeeResults: (page: Page) => Action<boolean> = (page) => {
  return async () => {
    await page.locator('[data-testid="report"]').wait()
    return true
  }
}
