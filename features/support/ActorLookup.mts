import { Actor } from './Actor.mjs'
import { type World } from '@cucumber/node'

export class ActorLookup {
  private readonly actorByName = new Map<string, Actor>()

  public findOrCreateActor(world: World, actorName: string): Actor {
    let actor = this.actorByName.get(actorName)
    if (!actor) {
      actor = new Actor(world, actorName)
      this.actorByName.set(actorName, actor)
    }
    return actor
  }

  public get actors(): IterableIterator<Actor> {
    return this.actorByName.values()
  }
}
