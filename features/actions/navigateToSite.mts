import { Page } from 'puppeteer'
import { Action, Actor } from '../support/Actor.mjs'

export const navigateToSite: () => Action<Page> = () => {
  return async (actor: Actor) => {
    const browser = await actor.world.getOrCreateBrowser()
    const page = await browser.newPage()
    await page.goto('http://localhost:3000')
    return page
  }
}