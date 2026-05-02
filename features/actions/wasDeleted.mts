import type { Page } from 'puppeteer'
import type { Action } from '../support/Actor.mjs'

export const wasDeleted: (page: Page) => Action<boolean> = (page) => {
  return async () => {
    await page.locator('::-p-text(was deleted)').wait()
    return true
  }
}
