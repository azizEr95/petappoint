import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { ChangeEvent } from 'react'
import '../../styles/routes/search.scss'
import '../../styles/components/common/SearchField.scss'
import type { VeterinaryPracticeSearchQueryType } from 'vetilib-shared/schemas/ZodSchemas'

type SearchFieldProps = {
  searchFilter: VeterinaryPracticeSearchQueryType
  filterAnimal: number | undefined
  handleChangeNameAddress?: (
    name: string | undefined,
    address: string | undefined,
  ) => void // if this is not undefined, then is this the SearchField on the LandingPage
  setCurrentPageNumber?: (page: number) => void
}

export function SearchField({
  searchFilter,
  filterAnimal,
  handleChangeNameAddress,
  setCurrentPageNumber
}: SearchFieldProps) {
  const [searchTermName, setSearchTermName] = useState(searchFilter.name)
  const [searchTermOrt, setSearchTermOrt] = useState(searchFilter.address)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const navigate = useNavigate()

  const handleGetCurrentLocation = () => {
    setIsLoadingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Reverse geocoding mit Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'de',
              },
            },
          )

          const data = await response.json()

          // Nur Stadt extrahieren
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            ''

          setSearchTermOrt(city)
          if (handleChangeNameAddress !== undefined) {
            handleChangeNameAddress(undefined, city)
          }
        } catch (error) {
          console.error('Fehler beim Abrufen der Adresse:', error)
          alert('Standort konnte nicht ermittelt werden')
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        setIsLoadingLocation(false)
        console.error('Geolocation Fehler:', error)
        alert('Zugriff auf Standort wurde verweigert')
      },
    )
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const t = e.target
    const typ = t.name
    const wert = t.value

    switch (typ) {
      case 'Name':
        setSearchTermName(wert)
        if (handleChangeNameAddress !== undefined) {
          handleChangeNameAddress(wert, undefined)
        }
        break
      case 'Ort':
        setSearchTermOrt(wert)
        if (handleChangeNameAddress !== undefined) {
          handleChangeNameAddress(undefined, wert)
        }
        break
    }
  }

  const handleSearch = () => {
    setCurrentPageNumber?.(1);
    const sortedServiceTypes = searchFilter.serviceTypeIds?.sort((a,b) => a - b)
    const searchName = searchTermName.trim();
    const searchOrt = searchTermOrt.trim();
    setSearchTermName(searchName);
    setSearchTermOrt(searchOrt);
    navigate({
      to: '/search',
      search: {
        address: searchOrt,
        animalType: searchFilter.animalTypeIds?.join("-") ?? "",
        serviceType: sortedServiceTypes?.join("-") !== undefined ? sortedServiceTypes.join("-") : "",
      },
      state: {
        filterAnimalId: filterAnimal,
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
      <div
        className="search-icon-container location-btn"
        onClick={handleGetCurrentLocation}
        style={{ cursor: isLoadingLocation ? 'wait' : 'pointer' }}
        title="Aktuellen Standort verwenden"
      >
        <i
          className={
            isLoadingLocation ? 'bi bi-arrow-clockwise spin' : 'bi bi-geo-alt'
          }
        ></i>
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
