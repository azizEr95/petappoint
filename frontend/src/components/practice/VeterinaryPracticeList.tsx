import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getVeterinaryPracticesByNameAddress } from '../../api/VeterinaryPracticeAPI'
import { VeterinaryPracticeCard } from './VeterinaryPracticeCard'
import type {
  AppointmentFilterType,
  VeterinaryPracticeSearchResultType,
} from 'petappoint-shared/schemas/ZodSchemas'
import '../../styles/components/practice/VeterinaryPracticeList.scss'

type VeterinaryPracticeListProps = {
  searchName: string
  searchOrt: string
  filterOptions: AppointmentFilterType
  onTotalChange?: (total: number) => void
  setCurrentPageNumber: (pageNumber: number) => void
  currentPageNumber: number
  searchParams?: SearchParamsType
}

export function VeterinaryPracticeList({
  searchName,
  searchOrt,
  filterOptions,
  onTotalChange,
  setCurrentPageNumber,
  currentPageNumber,
  searchParams
}: VeterinaryPracticeListProps) {
  const [pageSize, setPageSize] = useState(10)

  const { isSuccess, data } = useQuery<VeterinaryPracticeSearchResultType>({
    queryKey: [
      'tierarztpraxen',
      searchName,
      searchOrt,
      filterOptions.animalTypeIds,
      filterOptions.serviceTypeIds,
      currentPageNumber,
      pageSize,
    ],
    queryFn: () =>
      getVeterinaryPracticesByNameAddress({
        name: searchName,
        address: searchOrt,
        animalTypeIds: filterOptions.animalTypeIds,
        serviceTypeIds: filterOptions.serviceTypeIds,
        page: currentPageNumber,
        pageSize,
      }),
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPageNumber])

  useEffect(() => {
    // Notify parent of total count changes
    if (isSuccess && onTotalChange) {
      onTotalChange(data.total)
    }
  }, [isSuccess, data])

  if (isSuccess) {
    const totalPages = Math.ceil(data.total / data.pageSize)

    if (data.data.length !== 0) {
      return (
        <div id="VeterinaryPracticeList">
          {/* Results */}
          <div>
            {data.data.map((praxis) => {
              return (
                <VeterinaryPracticeCard
                  key={praxis.id}
                  practice={praxis}
                  filterOptions={filterOptions}
                  searchParams={searchParams}
                />
              )
            })}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-container">
            <div className="pagination-info">
              Zeige {(currentPageNumber - 1) * pageSize + 1}-
              {Math.min(currentPageNumber * pageSize, data.total)} von {data.total}{' '}
              Ergebnissen
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
                    setCurrentPageNumber(1) // Reset to first page when changing page size
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
                  onClick={() => setCurrentPageNumber(Math.max(1, currentPageNumber - 1))}
                  disabled={currentPageNumber === 1}
                  className="pagination-btn"
                >
                  <i className="bi bi-chevron-left"></i> Zurück
                </button>

                <span className="page-indicator">
                  Seite {currentPageNumber} von {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPageNumber(Math.min(totalPages, currentPageNumber + 1))}
                  disabled={currentPageNumber === totalPages}
                  className="pagination-btn"
                >
                  Weiter <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <div>Keine Suchergebnisse gefunden</div>
    }
  } else {
    return <div>Laden...</div>
  }
}
