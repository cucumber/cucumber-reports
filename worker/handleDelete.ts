import type { Env } from './env.ts'

export async function handleDelete(env: Env, id: string): Promise<Response> {
  await env.REPORTS_BUCKET.delete(id)
  return new Response(undefined, { status: 200 })
}
