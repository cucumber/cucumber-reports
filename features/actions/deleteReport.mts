import type { Page } from 'puppeteer'
import type { Action } from '../support/Actor.mjs'

export const deleteReport: (page: Page) => Action = (page) => {
  return async () => {
    await page.locator('button::-p-text(Delete it now)').wait()
    await page.click('button::-p-text(Delete it now)')
  }
}
