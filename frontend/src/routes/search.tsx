import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchField } from '../components/common/SearchField'
import { VeterinaryPracticeList } from '../components/practice/VeterinaryPracticeList'
import { SearchFilter } from '../components/common/SearchFilter'
import { stringToArray } from '../utils/ArrayStringFormat'
import type {
  AppointmentFilterType,
  VeterinaryPracticeSearchQueryType,
} from '../../../shared/schemas/ZodSchemas'

export type VeterinaryPracticeSearch = {
  // search, everything has to be a string
  name: string
  address: string
  animalType: string
  serviceType: string
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
  const { name, address, animalType, serviceType } = Route.useSearch()
  // serviceType or animalType are an empty string if the route was called from outside
   
  const [filterServiceType, setFilterServiceType] = useState<Array<number>>(
    stringToArray(serviceType.toString()),
  )
   
  const [filterAnimalType, setFilterAnimalType] = useState<Array<number>>(
    stringToArray(animalType.toString()),
  )
  const [totalResults, setTotalResults] = useState<number>(0)
  const [filterAnimal, setFilterAnimal] = useState<number | undefined>(
    undefined,
  )
  const [page, setPage] = useState<number>(1) // current pageNumber for VeterinaryPracticeList

  const filterOptions: AppointmentFilterType = {
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
    animal: filterAnimal,
  }

  const searchFilter: VeterinaryPracticeSearchQueryType = {
    name: name,
    address: address,
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
    page: page, // these page params are default
    pageSize: 10,
  }

  return (
    <>
      {/* Search Bar */}
      <div className="search-header">
        <div className="container search-bar-container">
          <SearchField
            searchFilter={searchFilter}
            filterAnimal={filterOptions.animal}
            setCurrentPageNumber={setPage} // wieder in Suche auf Seite 1 springen
          />
          <SearchFilter
            searchFilter={searchFilter}
            filterOptions={filterOptions}
            setFilterServiceType={setFilterServiceType}
            setFilterAnimalType={setFilterAnimalType}
            setFilterAnimal={setFilterAnimal}
            practicePage={null}
            landingPage={false}
            setCurrentPageNumber={setPage} // wieder in Suche auf Seite 1 springen
          />
        </div>
      </div>

      <div className="container search-results-container">
        {/* Search Summary */}
        <div className="search-summary">
          <h4>
            {name && <span>"{name}"</span>}
            {name && address && <span> in </span>}
            {address && <span>{address}</span>}
            {!name && !address && <span>Alle Tierarztpraxen</span>}
          </h4>
          <p className="results-count">
            <i className="bi bi-search"></i>
            {totalResults} {totalResults === 1 ? 'Ergebnis' : 'Ergebnisse'}{' '}
            gefunden
          </p>
        </div>

        {/* Results List */}
        <VeterinaryPracticeList
          searchName={name}
          searchOrt={address}
          filterOptions={filterOptions}
          onTotalChange={setTotalResults}
          setCurrentPageNumber={setPage}
          currentPageNumber={page}
        />
      </div>
    </>
  )
}