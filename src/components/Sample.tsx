import type { Envelope } from '@cucumber/messages'
import { EnvelopesProvider, ExecutionSummary, FilteredDocuments } from '@cucumber/react-components'
import type { FC } from 'react'

import sampleJson from '../assets/sample.json'

const envelopes = sampleJson as ReadonlyArray<Envelope>

export const Sample: FC = () => {
  return (
    <div data-testid="sample">
      <EnvelopesProvider envelopes={envelopes}>
        <div className="mb-5">
          <ExecutionSummary />
        </div>
        <FilteredDocuments />
      </EnvelopesProvider>
    </div>
  )
}
