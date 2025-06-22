import { EnvelopesStore, RetrievedObject } from './EnvelopesStore'
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const S3_BUCKET_NAME = process.env.APP_BUCKET_NAME ?? 'cucumber-reports-anonymous-envelopes'

export class S3EnvelopesStore implements EnvelopesStore {
  private readonly s3 = new S3({
    forcePathStyle: true,
    region: process.env.APP_AWS_REGION,
    endpoint: process.env.APP_AWS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY as string,
    }
  })

  async retrieve(id: string): Promise<RetrievedObject | undefined> {
    try {
      await this.s3.headObject({
        Bucket: S3_BUCKET_NAME,
        Key: id,
      })
    } catch (e) {
      console.info(`Failed to retrieve report ${id} from S3`, e)
      return undefined
    }

    const getUrl = await getSignedUrl(this.s3, new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: id,
    }), { expiresIn: 60 })

    return {
      getUrl,
    }
  }

  async delete(id: string): Promise<void> {
   await this.s3.deleteObject({
     Bucket: S3_BUCKET_NAME,
     Key: id,
   })
  }
}