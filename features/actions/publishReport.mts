import { type Action } from '../support/Actor.mjs'
import { touchReport } from './touchReport.mjs'
import { type PublishResult, type RequestComposer } from './types'
import { uploadContent } from './uploadContent.mjs'

export const publishReport: (
  fixture: string,
  requestComposer: RequestComposer,
  privateToken?: string
) => Action<PublishResult> = (fixture, requestComposer, privateToken) => {
  return async (actor) => {
    const touchResult = await actor.attemptsTo(touchReport())
    if (!touchResult.success) {
      return touchResult
    }

    const uploadResult = await actor.attemptsTo(
      uploadContent(fixture, requestComposer, touchResult.uploadUrl)
    )
    return {
      ...touchResult,
      ...uploadResult,
    }
  }
}
