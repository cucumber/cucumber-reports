export type RequestComposer = (content: string) => RequestInit

export interface PublishResult {
  success: boolean
  banner: string
  url?: string
}
