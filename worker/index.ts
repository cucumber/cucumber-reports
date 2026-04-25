import type { Env } from './env.ts'
import { handleDelete } from './handleDelete.ts'
import { handleFetch } from './handleFetch.ts'
import { handleTouch } from './handleTouch.ts'
import { handleUpload } from './handleUpload.ts'
import { writeResponse } from './writeResponse.ts'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // route: /api/reports
    if (path === '/api/reports') {
      if (request.method === 'GET') {
        return handleTouch(request, env)
      }
      return writeResponse(405, 'Only GET is supported')
    }

    // route: /api/reports/upload
    if (path === '/api/reports/upload') {
      if (request.method === 'PUT') {
        return handleUpload(request, env)
      }
      return writeResponse(405, 'Only PUT is supported')
    }

    // route: /api/reports/{id}
    const match = path.match(/^\/api\/reports\/([a-f0-9-]+)$/)
    if (match) {
      const id = match[1]
      switch (request.method) {
        case 'GET':
          return handleFetch(env, id)
        case 'DELETE':
          return handleDelete(env, id)
        default:
          return writeResponse(405, 'Only GET and DELETE are supported')
      }
    }

    return writeResponse(404, 'No such resource')
  },
}
