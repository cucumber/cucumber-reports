import { EnvelopesProvider, UrlSearchProvider } from '@cucumber/react-components'
import { useParams } from 'react-router-dom'

import { FilteredResults } from '../components/FilteredResults.tsx'
import { useDelete } from '../hooks/useDelete.ts'
import { useEnvelopes } from '../hooks/useEnvelopes.ts'

function Report() {
  const { id } = useParams<{ id: string }>()
  const { data: envelopes = [], isFetching, isError } = useEnvelopes(id as string)
  const { mutate } = useDelete(id as string)
  const handleDelete = () => mutate()

  if (isFetching) {
    return (
      <main className="flex-grow w-full max-w-7xl p-8 mx-auto">
        <p className="text-center">Just a moment...</p>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="flex-grow w-full max-w-7xl p-8 mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold">No report found</h1>
          <p>It might have expired, or been deleted.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow w-full max-w-7xl p-8 mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Your report</h1>
        <p>
          It will be automatically deleted after 24 hours.{' '}
          <button
            onClick={handleDelete}
            className="bg-red-700 text-white text-sm px-2 py-1 rounded-sm ml-1 cursor-pointer"
          >
            Delete it now
          </button>
        </p>
      </header>
      <article data-testid="report">
        <EnvelopesProvider envelopes={envelopes}>
          <UrlSearchProvider>
            <FilteredResults />
          </UrlSearchProvider>
        </EnvelopesProvider>
      </article>
    </main>
  )
}

export default Report
