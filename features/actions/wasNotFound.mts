import { type Action } from '../support/Actor.mjs'
import { Page } from 'puppeteer'

export const wasNotFound: (page: Page) => Action<boolean> = (page) => {
  return async () => {
    await page.locator('::-p-text(No report found)').wait()
    return true
  }
}
