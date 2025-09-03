import '@cucumber/node'

import { CustomWorld } from './CustomWorld.mjs'

declare module '@cucumber/node' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface World extends CustomWorld {}
}
