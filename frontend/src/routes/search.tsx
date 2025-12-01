import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SearchField } from '../components/common/SearchField'
import { VeterinaryPracticeList } from '../components/practice/VeterinaryPracticeList'
import { SearchFilter } from '../components/common/SearchFilter'
import type { AppointmentFilterType, VeterinaryPracticeSearchQueryType } from '../../../shared/schemas/ZodSchemas'


export type VeterinaryPracticeSearch = { // search, everything has to be a string
  name: string
  address: string,
  animalType: string,
  serviceType: string
}

export const Route = createFileRoute('/search')({
  validateSearch: (search: VeterinaryPracticeSearch): VeterinaryPracticeSearch => {
    return search;
  },
  component: SearchComponent,
})

function SearchComponent() {
  const { name, address, animalType, serviceType } = Route.useSearch();
  // serviceType or animalType could be undefined if the route was called from outside
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [filterServiceType, setFilterServiceType] = useState<Array<number>>(serviceType !== undefined ? stringToArray(serviceType.toString()): []);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [filterAnimalType, setFilterAnimalType] = useState<Array<number>>(animalType !== undefined ? stringToArray(animalType.toString()): []);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [filterAnimal, setFilterAnimal] = useState<number | undefined>(undefined);

  const filterOptions: AppointmentFilterType = {
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
    animal: filterAnimal
  }

  const searchFilter: VeterinaryPracticeSearchQueryType = {
    name: name,
    address: address,
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
    page: 1, // these page params are default
    pageSize: 10
  }

  return (
    <>
      {/* Search Bar */}
      <div className="search-header">
        <div className="container search-bar-container">
          <SearchField searchFilter={searchFilter} filterAnimal={filterOptions.animal}/>
          <SearchFilter searchFilter={searchFilter} filterOptions={filterOptions} setFilterServiceType={setFilterServiceType} setFilterAnimalType={setFilterAnimalType} setFilterAnimal={setFilterAnimal} practicePage={null} landingPage={false}/>
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
            {totalResults} {totalResults === 1 ? 'Ergebnis' : 'Ergebnisse'} gefunden
          </p>
        </div>

        {/* Results List */}
        <VeterinaryPracticeList searchName={name} searchOrt={address} filterOptions={filterOptions} onTotalChange={setTotalResults} />
      </div>
    </>
  )
}

function stringToArray(text: string): Array<number> {
  const array = Array.isArray(text) ? text : text.split('-');
  return array
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(Number)
    .filter(n => !isNaN(n) && Number.isInteger(n));
}
