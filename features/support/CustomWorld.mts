import { Browser, launch } from 'puppeteer'
import { ActorLookup } from './ActorLookup.mjs'
import { Actor } from './Actor.mjs'
import { type PublishResult } from '../actions/types'

export class CustomWorld {
  private readonly actorLookup = new ActorLookup()
  private browser: Browser | undefined
  public messagesFixture = 'messages-valid.ndjson'
  public publishResults: Array<PublishResult> = []

  public findOrCreateActor(actorName: string): Actor {
    return this.actorLookup.findOrCreateActor(this, actorName)
  }

  public async getOrCreateBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
    }
    return this.browser
  }

  public async destroyBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
    }
  }
}
