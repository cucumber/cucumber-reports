export interface RetrievedObject {
  getUrl: string
}

export interface EnvelopesStore {
  retrieve: (id: string) => Promise<RetrievedObject | undefined>
  delete: (id: string) => Promise<void>
}
