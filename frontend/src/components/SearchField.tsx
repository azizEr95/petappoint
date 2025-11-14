import { useState } from 'react'
import type { ChangeEvent } from 'react'
import '../styles/search.modules.css'
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
    <div className="search-bar-clean">
      <div className="search-icon-container">
        <i className="bi bi-search"></i>
      </div>
      <input
        type="text"
        className="search-input-clean"
        placeholder="Tierarzt, Behandlung oder Klinik"
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

      <style>{`
        .search-bar-clean {
          background: white;
          border-radius: var(--radius-full);
          padding: 0.5rem;
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          max-width: 700px;
        }

        .search-icon-container {
          padding: 0 1rem;
          color: var(--color-primary);
          display: flex;
          align-items: center;
        }

        .search-icon-container i {
          font-size: 1.2rem;
        }

        .search-input-clean {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1rem;
          padding: 0.8rem 0.5rem;
          color: var(--color-text-dark);
          background: transparent;
        }

        .search-input-clean::placeholder {
          color: var(--color-text-muted);
        }

        .location-input-clean {
          flex: 0.8;
        }

        .search-divider {
          width: 2px;
          height: 40px;
          background: var(--color-border);
        }

        .search-btn-clean {
          background: var(--color-primary);
          color: white;
          border: none;
          padding: 0.8rem 1.8rem;
          border-radius: var(--radius-full);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .search-btn-clean:hover {
          background: var(--color-primary-dark);
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .search-bar-clean {
            flex-direction: column;
            padding: 1.5rem;
            border-radius: var(--radius-xl);
          }

          .search-input-clean,
          .location-input-clean {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            margin: 0.3rem 0;
          }

          .search-divider,
          .search-icon-container {
            display: none;
          }

          .search-btn-clean {
            width: 100%;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}
