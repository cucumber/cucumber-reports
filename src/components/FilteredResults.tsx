import { ExecutionSummary, FilteredDocuments, SearchBar } from '@cucumber/react-components'

export const FilteredResults = () => {
  return (
    <div>
      <div className="mb-5">
        <ExecutionSummary />
        <SearchBar />
      </div>
      <FilteredDocuments />
    </div>
  )
}
