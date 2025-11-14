import { useState } from 'react'
import type { ChangeEvent } from 'react'
import '../styles/search.modules.css'
import styles from '../styles/searchField.modules.css'
import { Button } from 'react-bootstrap'
import { useNavigate } from '@tanstack/react-router'

type SearchFieldProps = {
  searchNameBeginn: string
  searchOrtBeginn: string
}

export function SearchField({
  searchNameBeginn,
  searchOrtBeginn,
}: SearchFieldProps) {
  const [searchTermName, setSearchTermName] = useState(searchNameBeginn)
  const [searchTermOrt, setSearchTermOrt] = useState(searchOrtBeginn)
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
        ort: searchTermOrt,
      },
    })
  }

  return (
    <div className={styles.searchBarClean}>
      <div className={styles.searchIconContainer}>
        <i className="bi bi-search"></i>
      </div>
      <input
        type="text"
        className={styles.searchInputClean}
        placeholder="Tierarzt, Behandlung oder Klinik"
        name="Name"
        value={searchTermName}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <div className={styles.searchDivider}></div>
      <div className={styles.searchIconContainer}>
        <i className="bi bi-geo-alt"></i>
      </div>
      <input
        type="text"
        className={`${styles.searchInputClean} ${styles.locationInputClean}`}
        placeholder="Stadt, PLZ oder Standort"
        name="Ort"
        value={searchTermOrt}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button className={styles.searchBtnClean} onClick={handleSearch}>
        Suchen
      </button>
    </div>
  )
}
