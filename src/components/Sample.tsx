import type { Envelope } from '@cucumber/messages'
import { EnvelopesProvider, InMemorySearchProvider } from '@cucumber/react-components'
import type { FC } from 'react'

import sampleJson from '../assets/sample.json'
import { FilteredResults } from './FilteredResults'

const envelopes = sampleJson as ReadonlyArray<Envelope>

export const Sample: FC = () => {
  return (
    <div data-testid="sample">
      <EnvelopesProvider envelopes={envelopes}>
        <InMemorySearchProvider>
          <FilteredResults />
        </InMemorySearchProvider>
      </EnvelopesProvider>
    </div>
  )
}
