import { createFileRoute } from '@tanstack/react-router'
import { SearchField } from '../components/common/SearchField'
import { VeterinaryPracticeList } from '../components/practice/VeterinaryPracticeList'
import { type AppointmentFilterType, type VeterinaryPracticeSearchQueryType } from '../../../shared/schemas/ZodSchemas'
import { SearchFilter } from '../components/common/SearchFilter'
import { useState } from 'react'

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
  const [filterServiceType, setFilterServiceType] = useState<number[]>(serviceType === undefined ? [] : stringToArray(serviceType.toString()));
  const [filterAnimalType, setFilterAnimalType] = useState<number[]>(animalType === undefined ? [] : stringToArray(animalType.toString()));
  const [totalResults, setTotalResults] = useState<number>(0);

  const filterOptions: AppointmentFilterType = {
    animalTypeIds: filterAnimalType,
    serviceTypeIds: filterServiceType,
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
      {/* Sticky Search Bar */}
      <div className="search-header-sticky">
        <div className="container search-bar-container">
          <SearchField searchFilter={searchFilter} />
          <SearchFilter searchFilter={searchFilter} filterOptions={filterOptions} setFilterServiceType={setFilterServiceType} setFilterAnimalType={setFilterAnimalType} practicePage={null} landingPage={false}/>
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
        <VeterinaryPracticeList searchName={name ?? ""} searchOrt={address ?? ""} filterOptions={filterOptions} onTotalChange={setTotalResults} />
      </div>

      <style>{`
        .search-header-sticky {
          position: sticky;
          top: 72px;
          z-index: 999;
          background: white;
          padding: 1.5rem 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          margin-bottom: 2rem;
        }

        .search-bar-container {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }

        .search-results-container {
          padding-top: 2rem;
          padding-bottom: 3rem;
        }

        .search-summary {
          margin-bottom: 2rem;
        }

        .search-summary h4 {
          color: var(--color-primary);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .results-count {
          color: var(--color-text-light);
          font-size: 0.95rem;
          margin: 0;
        }

        .results-count i {
          margin-right: 0.5rem;
          color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .search-header-sticky {
            position: relative;
            top: 0;
          }

          .search-bar-container {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  )
}

function stringToArray(text: string): number[] {
  if(text === undefined){
    return [];
  }

  const array = Array.isArray(text) ? text : text.split('-');
  return array
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(Number)
    .filter(n => !isNaN(n) && Number.isInteger(n));
}
