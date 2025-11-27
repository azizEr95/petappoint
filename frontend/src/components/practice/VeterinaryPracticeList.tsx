import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getVeterinaryPracticesByNameAddress } from '../../api/VeterinaryPracticeAPI'
import { VeterinaryPracticeCard } from './VeterinaryPracticeCard'
import type { AppointmentFilterType, VeterinaryPracticeSearchResultType } from '../../../../shared/schemas/ZodSchemas'

type VeterinaryPracticeListProps = {
  searchName: string
  searchOrt: string
  filterOptions: AppointmentFilterType
  onTotalChange?: (total: number) => void
}

export function VeterinaryPracticeList({
  searchName,
  searchOrt,
  filterOptions,
  onTotalChange
}: VeterinaryPracticeListProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { isSuccess, data } = useQuery<VeterinaryPracticeSearchResultType>({
    queryKey: ['tierarztpraxen', searchName, searchOrt, filterOptions.animalTypeIds, filterOptions.serviceTypeIds, page, pageSize],
    queryFn: () => getVeterinaryPracticesByNameAddress({
      name: searchName,
      address: searchOrt,
      animalTypeIds: filterOptions.animalTypeIds,
      serviceTypeIds: filterOptions.serviceTypeIds,
      page,
      pageSize
    }),
  })

  useEffect(() => {
    // Notify parent of total count changes
    if (isSuccess && data && onTotalChange) {
      onTotalChange(data.total)
    }
  }, [isSuccess, data])

  if (isSuccess && data) {
    const totalPages = Math.ceil(data.total / data.pageSize)

    if (data.data.length !== 0) {
      return (
        <div id="VeterinaryPracticeList">
          {/* Results */}
          <div>
            {data.data.map((praxis) => {
              return <VeterinaryPracticeCard key={praxis.id} practice={praxis} filterOptions={filterOptions} />
            })}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-container">
            <div className="pagination-info">
              Zeige {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, data.total)} von {data.total} Ergebnissen
            </div>

            <div className="pagination-controls">
              {/* Page Size Selector */}
              <div className="page-size-selector">
                <label htmlFor="pageSize">Pro Seite:</label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setPage(1) // Reset to first page when changing page size
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Page Navigation */}
              <div className="page-navigation">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  <i className="bi bi-chevron-left"></i> Zurück
                </button>

                <span className="page-indicator">
                  Seite {page} von {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="pagination-btn"
                >
                  Weiter <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <style>{`
            .pagination-container {
              margin-top: 3rem;
              padding: 1.5rem;
              background: white;
              border-radius: var(--radius-lg);
              box-shadow: var(--shadow-sm);
            }

            .pagination-info {
              text-align: center;
              color: var(--color-text-light);
              margin-bottom: 1rem;
              font-size: 0.9rem;
            }

            .pagination-controls {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 1rem;
              flex-wrap: wrap;
            }

            .page-size-selector {
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }

            .page-size-selector label {
              font-size: 0.9rem;
              color: var(--color-text-light);
            }

            .page-size-selector select {
              padding: 0.5rem 1rem;
              border: 1px solid var(--color-border);
              border-radius: var(--radius-md);
              background: white;
              cursor: pointer;
              font-size: 0.9rem;
            }

            .page-navigation {
              display: flex;
              align-items: center;
              gap: 1rem;
            }

            .page-indicator {
              font-size: 0.9rem;
              color: var(--color-text-dark);
              font-weight: 500;
            }

            .pagination-btn {
              padding: 0.5rem 1rem;
              background: var(--color-primary);
              color: white;
              border: none;
              border-radius: var(--radius-md);
              cursor: pointer;
              transition: all 0.2s;
              font-size: 0.9rem;
              display: flex;
              align-items: center;
              gap: 0.3rem;
            }

            .pagination-btn:hover:not(:disabled) {
              background: var(--color-primary-dark);
              transform: translateY(-1px);
            }

            .pagination-btn:disabled {
              background: var(--color-border);
              cursor: not-allowed;
              opacity: 0.5;
            }

            @media (max-width: 768px) {
              .pagination-controls {
                flex-direction: column;
              }

              .page-size-selector,
              .page-navigation {
                width: 100%;
                justify-content: center;
              }
            }
          `}</style>
        </div>
      )
    } else {
      return <div>Keine Suchergebnisse gefunden</div>
    }
  } else {
    return <div>Laden...</div>
  }
}
