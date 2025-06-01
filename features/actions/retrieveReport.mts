import { Page } from 'puppeteer'
import { Action, Actor } from '../support/Actor.mjs'
import { PublishResult } from './types'

export const retrieveReport: (publishResultOrUrl: PublishResult | string) => Action<Page> = (publishResultOrUrl) => {
  return async (actor: Actor) => {
    const browser = await actor.world.getOrCreateBrowser()
    const page = await browser.newPage()
    await page.goto(typeof publishResultOrUrl === 'string' ? publishResultOrUrl : publishResultOrUrl.url)
    return page
  }
}