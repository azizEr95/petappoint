import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Container } from 'react-bootstrap'
import { SearchField } from '../components/SearchField'
import { VeterinaryPracticeList } from '../components/VeterinaryPracticeList'
import styles from '../styles/searchRoute.modules.css'

const searchSchema = z.object({
  name: z.string().default(''),
  ort: z.string().default(''),
})

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  component: SearchComponent,
})

function SearchComponent() {
  const { name, ort } = Route.useSearch()

  return (
    <>
      {/* Sticky Search Bar */}
      <div className={styles.searchHeaderSticky}>
        <div className={`container ${styles.searchBarContainer}`}>
          <SearchField searchNameBeginn={name} searchOrtBeginn={ort} />
        </div>
      </div>

      <div className={`container ${styles.searchResultsContainer}`}>
        {/* Search Summary */}
        <div className={styles.searchSummary}>
          <h4>
            {name && <span>"{name}"</span>}
            {name && ort && <span> in </span>}
            {ort && <span>{ort}</span>}
            {!name && !ort && <span>Alle Tierarztpraxen</span>}
          </h4>
          <p className={styles.resultsCount}>
            <i className="bi bi-search"></i>
            Gefundene Ergebnisse
          </p>
        </div>

        {/* Results List */}
        <VeterinaryPracticeList searchName={name} searchOrt={ort} />
      </div>
    </>
  )
}
