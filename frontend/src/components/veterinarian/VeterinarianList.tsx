import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from '@tanstack/react-router'
import { VeterinarianCard } from './VeterinarianCard'
import type { VeterinariansType } from 'vetilib-shared/schemas/ZodSchemas'
import type { ChangeEvent } from 'react'
import '@/styles/components/veterinarian/Veterinarian.scss'

type VeterinarianListProps = {
  veterinarians: Array<VeterinariansType> | undefined
  searchName: string
  sortBy: string
  specialization: string
}

export function VeterinarianList({
  veterinarians,
  searchName,
  sortBy,
  specialization,
}: VeterinarianListProps) {
  const navigate = useNavigate()
  const [searchString, setSearchString] = useState<string>(searchName || '')
  const [sortByState, setSortByState] = useState<string>(sortBy || 'name-asc')
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    Set<string>
  >(
    specialization
      ? new Set(specialization.split(',').filter((s) => s))
      : new Set(),
  )
  const [filteredVeterinarians, setFilteredVeterinarians] = useState<
    Array<VeterinariansType> | undefined
  >(veterinarians)

  // Extract unique specializations (placeholder - empty for now)
  const allSpecializations: string[] = []

  useEffect(() => {
    handleFilter()
  }, [])

  const handleFilter = () => {
    if (!veterinarians) {
      return
    }

    // Text search filter
    let filtered = veterinarians.filter((vet) => {
      const query = searchString.toLowerCase()
      if (
        vet.firstName.toLowerCase().includes(query) ||
        vet.lastName.toLowerCase().includes(query)
      ) {
        return true
      }
      return false
    })

    // Specialization filter (disabled for now)
    // if (selectedSpecializations.size > 0) {
    //   filtered = filtered.filter((vet) => {
    //     const vetSpecs = vet.specializations?.map((s) => s.name) || []
    //     return Array.from(selectedSpecializations).some((spec) =>
    //       vetSpecs.includes(spec),
    //     )
    //   })
    // }

    // Sort
    filtered = applySorting(filtered, sortByState)

    setFilteredVeterinarians(filtered)
  }

  const applySorting = (
    vets: Array<VeterinariansType>,
    sort: string,
  ): Array<VeterinariansType> => {
    const copy = [...vets]
    switch (sort) {
      case 'name-asc':
        return copy.sort((a, b) =>
          a.lastName.localeCompare(b.lastName),
        )
      case 'name-desc':
        return copy.sort((a, b) =>
          b.lastName.localeCompare(a.lastName),
        )
      case 'recent':
        return copy.sort((a, b) => b.id - a.id)
      default:
        return copy
    }
  }

  const handleSearch = () => {
    handleFilter()
    updateUrl()
  }

  const handleSortChange = (newSort: string) => {
    setSortByState(newSort)
    // Apply sort immediately and update URL
    if (filteredVeterinarians) {
      const sorted = applySorting(filteredVeterinarians, newSort)
      setFilteredVeterinarians(sorted)
    }
    updateUrl(newSort)
  }

  const handleSpecializationToggle = (spec: string) => {
    const newSpecs = new Set(selectedSpecializations)
    if (newSpecs.has(spec)) {
      newSpecs.delete(spec)
    } else {
      newSpecs.add(spec)
    }
    setSelectedSpecializations(newSpecs)
    updateUrl(sortByState, newSpecs)
  }

  const handleClearFilters = () => {
    setSelectedSpecializations(new Set())
    updateUrl(sortByState, new Set())
  }

  const updateUrl = (newSort?: string, newSpecs?: Set<string>) => {
    navigate({
      to: '/veterinarians',
      search: (prev) => ({
        ...prev,
        veterinarianName: searchString,
        sortBy: newSort || sortByState,
        specialization: newSpecs
          ? Array.from(newSpecs).join(',')
          : Array.from(selectedSpecializations).join(','),
      }),
      replace: true,
    })
  }

  const handleClickCreate = () => {
    navigate({ to: '/veterinarians/create' })
  }

  if (!filteredVeterinarians) {
    return <div>Lade Tierärzte ...</div>
  }

  return (
    <div>
      <h2 className="mb-3 veterinarian-heading">Tierärzte</h2>

      <div className="veterinarian-search-container">
        <div className="veterinarian-search-wrapper">
          <div className="search-bar-clean">
            <div className="search-icon-container">
              <i className="bi bi-search"></i>
            </div>
            <input
              type="text"
              className="search-input-clean"
              placeholder="Name oder Email des Tierarztes"
              value={searchString}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchString(e.target.value)
              }
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn-clean" onClick={handleSearch}>
              Suchen
            </button>
          </div>
        </div>
      </div>

      {/* Sort and Filter Controls */}
      <div className="veterinarian-controls">
        <div className="sort-dropdown-wrapper">
          <label htmlFor="sort-select">Sortierung:</label>
          <select
            id="sort-select"
            className="form-select sort-select"
            value={sortByState}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="recent">Zuletzt hinzugefügt</option>
          </select>
        </div>

        {/* Specialization Filter Chips */}
        {allSpecializations.length > 0 && (
          <div className="specialization-filter">
            <div className="filter-label">Spezialisierungen:</div>
            <div className="specialization-chips">
              {allSpecializations.map((spec) => (
                <button
                  key={spec}
                  className={`chip ${selectedSpecializations.has(spec) ? 'active' : ''}`}
                  onClick={() => handleSpecializationToggle(spec)}
                >
                  {spec}
                </button>
              ))}
            </div>
            {selectedSpecializations.size > 0 && (
              <button
                className="btn btn-sm btn-outline-secondary clear-filters"
                onClick={handleClearFilters}
              >
                Filter löschen
              </button>
            )}
          </div>
        )}

        {/* Create Button */}
        <div className="veterinarian-create-button">
          <Button variant="primary" onClick={handleClickCreate}>
            Tierarzt erstellen
          </Button>
        </div>
      </div>

      <div className="veterinarian-cards-container">
        {filteredVeterinarians.map((vet) => (
          <VeterinarianCard key={vet.id} veterinarian={vet} />
        ))}
        {filteredVeterinarians.length === 0 && (
          <div className="no-veterinarians-message">
            Keine Tierärzte gefunden.
          </div>
        )}
      </div>
    </div>
  )
}
