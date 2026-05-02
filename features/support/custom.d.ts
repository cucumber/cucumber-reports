import '@cucumber/node'

import { CustomWorld } from './CustomWorld.mjs'

declare module '@cucumber/node' {
  interface World extends CustomWorld {}
}
