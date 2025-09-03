import { Page } from 'puppeteer'
import { type Action } from '../support/Actor.mjs'

export const isScheduledForDeletion: (page: Page) => Action<boolean> = (page) => {
  return async () => {
    await page.locator('::-p-text(will be automatically deleted after 24 hours)').wait()
    return true
  }
}
