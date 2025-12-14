import { useState, useEffect, useRef } from 'react'
import { apiUrl } from '@/utils/api'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/atoms/user.atom'

interface AutocompleteInputProps {
  label: string
  optional?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  endpoint: 'medical-conditions' | 'medications' | 'allergies'
  onSuggestionSelect?: (suggestion: MedicalConditionSuggestion | MedicationSuggestion | AllergySuggestion) => void
}

export interface MedicalConditionSuggestion {
  name: string
  description?: string
  category?: string
  icdCode?: string
  synonyms?: string[]
}

export interface MedicationSuggestion {
  name: string
  genericName?: string
  brandNames?: string[]
  drugClass?: string
  commonDosages?: string[]
  forms?: string[]
}

export interface AllergySuggestion {
  name: string
  type?: string
  commonReactions?: string[]
  crossReactivities?: string[]
}

type Suggestion = MedicalConditionSuggestion | MedicationSuggestion | AllergySuggestion

export function AutocompleteInput({
  label,
  optional = false,
  placeholder,
  value,
  onChange,
  disabled = false,
  endpoint,
  onSuggestionSelect,
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const authData = useAtomValue(userAtom)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const justSelectedRef = useRef(false)

  // Fetch suggestions when value changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Skip fetch if we just selected a suggestion
    if (justSelectedRef.current) {
      justSelectedRef.current = false
      return
    }

    if (!value || value.length < 2 || !authData?.accessToken) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          apiUrl(`/api/v1/autocomplete/${endpoint}?query=${encodeURIComponent(value)}&limit=5`),
          {
            headers: {
              'Authorization': `Bearer ${authData.accessToken}`,
            },
          }
        )
        const result = await response.json()
        if (result.success && result.data?.suggestions) {
          setSuggestions(result.data.suggestions)
          setShowSuggestions(result.data.suggestions.length > 0)
          setSelectedIndex(-1)
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [value, endpoint, authData?.accessToken])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSuggestionClick = (suggestion: Suggestion) => {
    justSelectedRef.current = true
    onChange(suggestion.name)
    setSuggestions([])
    setShowSuggestions(false)
    onSuggestionSelect?.(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const getSubtext = (suggestion: Suggestion): string => {
    if ('description' in suggestion && suggestion.description) {
      return suggestion.description
    }
    if ('drugClass' in suggestion && suggestion.drugClass) {
      return suggestion.drugClass
    }
    if ('type' in suggestion && suggestion.type) {
      return `Type: ${suggestion.type}`
    }
    return ''
  }

  const getExtraInfo = (suggestion: Suggestion): string | null => {
    if ('commonDosages' in suggestion && suggestion.commonDosages?.length) {
      return `Dosages: ${suggestion.commonDosages.join(', ')}`
    }
    if ('commonReactions' in suggestion && suggestion.commonReactions?.length) {
      return `Reactions: ${suggestion.commonReactions.slice(0, 3).join(', ')}`
    }
    if ('category' in suggestion && suggestion.category) {
      return `Category: ${suggestion.category}`
    }
    return null
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label
        className="block mb-2"
        style={{
          fontFamily: 'Inter',
          fontSize: '16px',
          lineHeight: '121%',
          letterSpacing: '0%',
          verticalAlign: 'middle',
          color: disabled ? '#9CA3AF' : '#000000',
        }}
      >
        <span style={{ fontWeight: 900 }}>{label}</span>
        {optional && <span style={{ fontWeight: 400 }}> (Optional)</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`w-full px-4 rounded-full outline-none border-2 border-white focus:border-black ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
          style={{
            height: '44px',
            fontFamily: 'Inter',
            fontSize: '14px',
            fontWeight: 400,
            boxShadow: '0px 0px 30px 0px #385DA41A',
          }}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#003AAB] rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[280px] overflow-y-auto"
          style={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)' }}
        >
          {suggestions.map((suggestion, index) => {
            const subtext = getSubtext(suggestion)
            const extraInfo = getExtraInfo(suggestion)

            return (
              <button
                key={`${suggestion.name}-${index}`}
                type="button"
                className={`w-full px-4 py-3 text-left transition-colors ${
                  index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="font-semibold text-sm text-gray-900">{suggestion.name}</div>
                {subtext && (
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{subtext}</div>
                )}
                {extraInfo && (
                  <div className="text-xs text-[#003AAB] mt-1">{extraInfo}</div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

