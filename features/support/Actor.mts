import { type World } from '@cucumber/node'

export type Action<Answer = void> = (actor: Actor) => Promise<Answer> | Answer
export type DefaultFunction<T> = () => T

export class Actor {
  private readonly memory = new Map<string, unknown>()
  public readonly world: World
  public readonly name: string

  constructor(world: World, name: string) {
    this.world = world
    this.name = name
  }

  public remember<T>(key: string, value: T) {
    this.memory.set(key, value)
  }

  public recall<T>(key: string, defaultFunction?: DefaultFunction<T>): T {
    if (!this.memory.has(key) && defaultFunction) {
      this.memory.set(key, defaultFunction())
    }
    return this.memory.get(key) as T
  }

  public async attemptsTo<Answer>(action: Action<Answer>): Promise<Answer> {
    return action(this)
  }

  public async ask<Answer>(action: Action<Answer>): Promise<Answer> {
    return action(this)
  }
}
