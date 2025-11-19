import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Container } from 'react-bootstrap'
import { SearchField } from '../components/common/SearchField'
import { VeterinaryPracticeList } from '../components/practice/VeterinaryPracticeList'

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
      <div className="search-header-sticky">
        <div className="container search-bar-container">
          <SearchField searchNameBeginn={name} searchOrtBeginn={ort} />
        </div>
      </div>

      <div className="container search-results-container">
        {/* Search Summary */}
        <div className="search-summary">
          <h4>
            {name && <span>"{name}"</span>}
            {name && ort && <span> in </span>}
            {ort && <span>{ort}</span>}
            {!name && !ort && <span>Alle Tierarztpraxen</span>}
          </h4>
          <p className="results-count">
            <i className="bi bi-search"></i>
            Gefundene Ergebnisse
          </p>
        </div>

        {/* Results List */}
        <VeterinaryPracticeList searchName={name} searchOrt={ort} />
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
          justify-content: center;
          align-items: center;
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
        }
      `}</style>
    </>
  )
}
