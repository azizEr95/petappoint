import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { InlineFilterBar } from '../components/common/InlineFilterBar'
import { VeterinaryPracticeList } from '../components/practice/VeterinaryPracticeList'
import { stringToArray } from '../utils/ArrayStringFormat'
import type {
  AppointmentFilterType,
} from 'petappoint-shared/schemas/ZodSchemas'
import { useTitle } from '@/utils/useTitle'

export type VeterinaryPracticeSearch = {
  // search, everything has to be a string
  address: string
  animalType: string
  serviceType: string
  animal?: string
}

export const Route = createFileRoute('/search')({
  validateSearch: (
    search: VeterinaryPracticeSearch,
  ): VeterinaryPracticeSearch => {
    return search
  },
  component: SearchComponent,
})

function SearchComponent() {
  useTitle('Suche');
  const { address, animalType, serviceType, animal } = Route.useSearch()
  // serviceType or animalType are an empty string if the route was called from outside
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [filterServiceType, setFilterServiceType] = useState<Array<number>>(serviceType !== undefined ? stringToArray(serviceType.toString()) : [])
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [filterAnimalType, setFilterAnimalType] = useState<Array<number>>(animalType !== undefined ? stringToArray(animalType.toString()) : [])
  const [filterLocation, setFilterLocation] = useState<string>(address || '')
  const [totalResults, setTotalResults] = useState<number>(0)
  const [filterAnimal, setFilterAnimal] = useState<number | undefined>(
    animal !== undefined ? parseInt(animal) : undefined,
  )
  const [page, setPage] = useState<number>(1) // current pageNumber for VeterinaryPracticeList

  // Applied filters - only update when "Apply" button clicked
  const [appliedFilterOptions, setAppliedFilterOptions] = useState<AppointmentFilterType>({
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
    animal: filterAnimal,
  })

  const handleApplyFilters = () => {
    setAppliedFilterOptions({
      animalTypeIds: filterAnimalType,
      serviceTypeIds: filterServiceType,
      animal: filterAnimal,
    })
    setPage(1)
  }

  return (
    <>
      {/* Inline Filter Bar */}
      <div className="search-header">
        <div className="container search-bar-container">
          <InlineFilterBar
            filterAnimalType={filterAnimalType}
            filterServiceType={filterServiceType}
            filterLocation={filterLocation}
            filterAnimal={filterAnimal}
            setFilterAnimalType={setFilterAnimalType}
            setFilterServiceType={setFilterServiceType}
            setFilterLocation={setFilterLocation}
            setFilterAnimal={setFilterAnimal}
            setCurrentPageNumber={handleApplyFilters}
          />
        </div>
      </div>

      <div className="container search-results-container">
        {/* Search Summary */}
        <div className="search-summary">
          <h4>
            {filterLocation && <span>{filterLocation}</span>}
            {!filterLocation && <span>Bitte Filter auswählen</span>}
          </h4>
          <p className="results-count">
            <i className="bi bi-search"></i>
            {'  '}{totalResults} {totalResults === 1 ? 'Ergebnis' : 'Ergebnisse'}{' '}
            gefunden
          </p>
        </div>

        {/* Results List */}
        {filterLocation ? (
          <VeterinaryPracticeList
            searchName={''}
            searchOrt={filterLocation}
            filterOptions={appliedFilterOptions}
            onTotalChange={setTotalResults}
            setCurrentPageNumber={setPage}
            currentPageNumber={page}
            searchParams={{
              address: address || '',
              animalType: animalType || '',
              serviceType: serviceType || '',
              animal: animal || '',
            }}
          />
        ) : (
          <div className="alert alert-info text-center py-5">
            <p>Bitte wählen Sie mindestens einen Standort aus, um Ergebnisse zu sehen.</p>
          </div>
        )}
      </div>
    </>
  )
}