import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAvailableCities } from '../../api/LocationAPI'
import '../../styles/components/common/Autocomplete.scss'

type LocationAutocompleteProps = {
  value: string
  onChange: (location: string) => void
  placeholder: string
  label?: string
  showGeolocationButton?: boolean
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  label,
  showGeolocationButton = false,
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch available cities
  const { data: cities = [] } = useQuery<Array<string>>({
    queryKey: ['availableCities'],
    queryFn: getAvailableCities,
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  // Filter cities based on search text
  const filteredCities = cities
    .filter((city) => city.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => a.localeCompare(b))

  // Handle city selection
  const handleSelectCity = (city: string) => {
    onChange(city)
    setSearchText('')
    setHighlightedIndex(-1)
    setTimeout(() => setIsOpen(false), 0)
    inputRef.current?.focus()
  }

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setSearchText('')
    inputRef.current?.focus()
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    onChange(e.target.value)
    setIsOpen(true)
  }

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true)
  }

  // Handle geolocation
  const handleGetCurrentLocation = () => {
    setIsLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'de' } },
          )
          const data = await response.json()
          const city =
            data.address?.city || data.address?.town || data.address?.village || ''
          if (city) {
            onChange(city)
            setSearchText('')
            setIsOpen(false)
          }
        } catch (error) {
          console.error('Fehler beim Abrufen der Adresse:', error)
          alert('Standort konnte nicht ermittelt werden')
        } finally {
          setIsLoadingLocation(false)
        }
      },
      () => {
        setIsLoadingLocation(false)
        alert('Zugriff auf Standort wurde verweigert')
      },
    )
  }

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setHighlightedIndex(-1)
      return
    }

    if (e.key === 'Tab') {
      setIsOpen(false)
      setHighlightedIndex(-1)
      return
    }

    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
        handleSelectCity(filteredCities[highlightedIndex])
        setHighlightedIndex(-1)
      }
    }
  }

  return (
    <div className="autocomplete-container location-autocomplete" ref={containerRef}>
      {label && <label className="autocomplete-label">{label}</label>}

      <div className="location-autocomplete-wrapper">
        <div className="autocomplete-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="form-control autocomplete-input"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            aria-label={label || placeholder}
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            data-testid={"search-place-input"}
          />

          {value && (
            <button
              className="autocomplete-clear-btn"
              onClick={handleClear}
              title="Auswahl löschen"
              type="button"
            >
              ×
            </button>
          )}

          {isOpen && filteredCities.length > 0 && (
            <div className="autocomplete-dropdown" role="listbox">
              {filteredCities.map((city, index) => (
                <div
                  key={city}
                  className={`autocomplete-option ${highlightedIndex === index ? 'highlighted' : ''
                    }`}
                  onClick={() => handleSelectCity(city)}
                  role="option"
                  aria-selected={value === city}
                >
                  {city}
                </div>
              ))}
            </div>
          )}

          {isOpen && searchText && filteredCities.length === 0 && (
            <div className="autocomplete-no-results">
              Keine Ergebnisse für "{searchText}"
            </div>
          )}
        </div>

        {showGeolocationButton && (
          <button
            type="button"
            className="location-geolocation-btn"
            onClick={handleGetCurrentLocation}
            disabled={isLoadingLocation}
            title="Aktuellen Standort verwenden"
          >
            <i
              className={
                isLoadingLocation ? 'bi bi-arrow-clockwise spin' : 'bi bi-geo-alt'
              }
            ></i>
          </button>
        )}
      </div>
    </div>
  )
}
