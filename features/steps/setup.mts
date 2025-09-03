import { ParameterType as defineParameterType, WorldCreator } from '@cucumber/node'
import { CustomWorld } from '../support/CustomWorld.mjs'

WorldCreator(
  () => new CustomWorld(),
  async (world: CustomWorld) => world.destroyBrowser()
)

defineParameterType({
  name: 'actor',
  regexp: /[A-Z][a-z]+/,
  transformer(this: CustomWorld, actorName: string) {
    return this.findOrCreateActor(actorName)
  },
})
