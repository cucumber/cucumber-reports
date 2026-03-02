interface Env {
  REPORTS_BUCKET: R2Bucket
  ALLOWED_ORIGIN: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'access-control-allow-origin': env.ALLOWED_ORIGIN,
      'access-control-allow-methods': 'GET, DELETE, OPTIONS',
      'access-control-allow-headers': '*',
    }

    if (request.method === 'OPTIONS') {
      return new Response(undefined, { headers: corsHeaders })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return new Response('Missing required parameter id', {
        status: 400,
        headers: {
          ...corsHeaders,
          'content-type': 'text/plain; charset=UTF-8',
        },
      })
    }

    const object = await env.REPORTS_BUCKET.head(id)
    if (!object) {
      return new Response('No report found with id ' + id, {
        status: 404,
        headers: {
          ...corsHeaders,
          'content-type': 'text/plain; charset=UTF-8',
        },
      })
    }

    switch (request.method) {
      case 'GET': {
        const data = await env.REPORTS_BUCKET.get(id)
        if (!data) {
          return new Response('No report found with id ' + id, {
            status: 404,
            headers: {
              ...corsHeaders,
              'content-type': 'text/plain; charset=UTF-8',
            },
          })
        }
        return new Response(data.body, {
          status: 200,
          headers: {
            ...corsHeaders,
            'content-type': data.httpMetadata?.contentType ?? 'application/octet-stream',
          },
        })
      }
      case 'DELETE': {
        await env.REPORTS_BUCKET.delete(id)
        return new Response(undefined, {
          status: 200,
          headers: corsHeaders,
        })
      }
      default: {
        return new Response('Only GET and DELETE are supported', {
          status: 405,
          headers: {
            ...corsHeaders,
            'content-type': 'text/plain; charset=UTF-8',
          },
        })
      }
    }
  },
}
