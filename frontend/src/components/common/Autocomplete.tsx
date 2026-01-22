import { useEffect, useRef, useState } from 'react'
import '../../styles/components/common/Autocomplete.scss'

export type AutocompleteOption = {
  id: number
  name: string
}

type AutocompleteProps = {
  options: Array<AutocompleteOption>
  value: number | undefined
  onChange: (id: number | undefined) => void
  placeholder: string
  label?: string
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder,
  label,
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter options based on search text
  const filteredOptions = options
    .filter((opt) => opt.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))

  // Get selected option
  const selectedOption = options.find((opt) => opt.id === value)

  // Handle option selection
  const handleSelectOption = (optionId: number) => {
    onChange(optionId)
    setSearchText('')
    setIsSearching(false)
    setHighlightedIndex(-1)
    setTimeout(() => setIsOpen(false), 0)
    inputRef.current?.focus()
  }

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(undefined)
    setSearchText('')
    setIsSearching(false)
    inputRef.current?.focus()
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchText(newValue)
    setIsSearching(true)
    setIsOpen(true)
    // Clear selection when user starts typing over selected value
    if (value !== undefined) {
      onChange(undefined)
    }
  }

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true)
    // When focusing on selection, prepare for new search
    if (value !== undefined) {
      setSearchText('')
      setIsSearching(true)
    }
  }

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchText('')
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
      setSearchText('')
      setHighlightedIndex(-1)
      return
    }

    if (e.key === 'Tab') {
      setIsOpen(false)
      setSearchText('')
      setHighlightedIndex(-1)
      return
    }

    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelectOption(filteredOptions[highlightedIndex].id)
        setHighlightedIndex(-1)
      }
    }
  }

  return (
    <div className="autocomplete-container" ref={containerRef}>
      {label && <label className="autocomplete-label">{label}</label>}

      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="form-control autocomplete-input"
          placeholder={placeholder}
          value={isSearching ? searchText : (selectedOption ? selectedOption.name : searchText)}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          aria-label={label || placeholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />

        {selectedOption && (
          <button
            className="autocomplete-clear-btn"
            onClick={handleClear}
            title="Auswahl löschen"
            type="button"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="autocomplete-dropdown" role="listbox">
          {filteredOptions.map((option, index) => (
            <div
              key={option.id}
              className={`autocomplete-option ${
                value === option.id ? 'selected' : ''
              } ${highlightedIndex === index ? 'highlighted' : ''}`}
              onClick={() => handleSelectOption(option.id)}
              role="option"
              aria-selected={value === option.id}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}

      {isOpen && searchText && filteredOptions.length === 0 && (
        <div className="autocomplete-no-results">
          Keine Ergebnisse für "{searchText}"
        </div>
      )}
    </div>
  )
}
