import { GetObjectCommand, S3 } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3({
  forcePathStyle: true,
  endpoint: process.env.APP_AWS_ENDPOINT,
})

/**
 * @param {import('aws-lambda').APIGatewayProxyEventV2} event
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResultV2>}
 */
export const handler = async (event) => {
  const id = event.queryStringParameters?.id
  if (!id) {
    return {
      statusCode: 400,
      headers: {
        'content-type': 'text/plain; charset=UTF-8',
      },
      body: 'Missing required parameter id',
    }
  }

  try {
    await s3.headObject({
      Bucket: process.env.APP_BUCKET_NAME,
      Key: id,
    })
  } catch(e) {
    console.error(e)
    return {
      statusCode: 404,
      headers: {
        'content-type': 'text/plain; charset=UTF-8',
      },
      body: 'No report found with id ' + id,
    }
  }

  const method = event.requestContext.http.method
  switch (method) {
    case 'GET': {
      const getUrl = await getSignedUrl(s3, new GetObjectCommand({
        Bucket: process.env.APP_BUCKET_NAME,
        Key: id,
      }), { expiresIn: 60 })
      return {
        headers: {
          'location': getUrl,
          'content-type': 'text/plain; charset=UTF-8',
        },
        statusCode: 302,
      }
    }
    case 'DELETE': {
      await s3.deleteObject({
        Bucket: process.env.APP_BUCKET_NAME,
        Key: id,
      })
      return {
        statusCode: 200,
      }
    }
    default: {
      return {
        statusCode: 405,
        headers: {
          'content-type': 'text/plain; charset=UTF-8',
        },
        body: 'Only GET and DELETE are supported',
      }
    }
  }
}