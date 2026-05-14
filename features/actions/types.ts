export type RequestComposer = (url: string, content: string) => Request | Promise<Request>

type TouchSuccess = {
  success: true
  banner: string
  url: string
  uploadUrl: string
}

type TouchFailure = {
  success: false
  banner: string
}

export type TouchResult = TouchSuccess | TouchFailure

export type UploadResult = {
  success: boolean
  status: number
}

export type PublishResult = {
  success: boolean
  banner: string
  url?: string
  status?: number
}
