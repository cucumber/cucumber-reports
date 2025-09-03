import type {FC} from 'react'
import { EnvelopesProvider, InMemorySearchProvider } from '@cucumber/react-components'
import { FilteredResults } from './FilteredResults'
import sampleJson from '../assets/sample.json'
import type {Envelope} from "@cucumber/messages";

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