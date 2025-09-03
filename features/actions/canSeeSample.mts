import { Page } from 'puppeteer'
import { type Action } from '../support/Actor.mjs'

export const canSeeSample: (page: Page) => Action<boolean> = (page) => {
  return async () => {
    await page.locator('[data-testid="sample"]').wait()
    return true
  }
}
