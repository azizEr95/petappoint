import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { ChangeEvent } from 'react'
import '../../styles/routes/search.scss'
import '../../styles/components/common/SearchField.scss'
import type { VeterinaryPracticeSearchQueryType } from '../../../../shared/schemas/ZodSchemas'

type SearchFieldProps = {
  searchFilter: VeterinaryPracticeSearchQueryType
}

export function SearchField({
  searchFilter
}: SearchFieldProps) {
  const [searchTermName, setSearchTermName] = useState(searchFilter.name)
  const [searchTermOrt, setSearchTermOrt] = useState(searchFilter.address)
  const navigate = useNavigate()

  // bei Suche ohne Ortangabe aktuellen Standort nehmen??: https://wiki.selfhtml.org/wiki/Geolocation
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const t = e.target
    const typ = t.name
    const wert = t.value

    switch (typ) {
      case 'Name':
        setSearchTermName(wert)
        break
      case 'Ort':
        setSearchTermOrt(wert)
        break
    }
  }

  const handleSearch = () => {
    navigate({
      to: '/search',
      search: {
        name: searchTermName,
        address: searchTermOrt,
      },
    })
  }

  return (
    <div className="search-bar-clean">
      <div className="search-icon-container">
        <i className="bi bi-search"></i>
      </div>
      <input
        type="text"
        className="search-input-clean"
        placeholder="Tierarzt oder Klinik"
        name="Name"
        value={searchTermName}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <div className="search-divider"></div>
      <div className="search-icon-container">
        <i className="bi bi-geo-alt"></i>
      </div>
      <input
        type="text"
        className="search-input-clean location-input-clean"
        placeholder="Stadt, PLZ oder Standort"
        name="Ort"
        value={searchTermOrt}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button className="search-btn-clean" onClick={handleSearch}>
        Suchen
      </button>
    </div>
  )
}
