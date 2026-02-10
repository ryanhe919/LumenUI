import React, { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '../../../utils/cn'
import { SIZE_INPUT_CONFIG } from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'
import { ErrorMessage } from '../../_internal/ErrorMessage'

export interface LMSearchInputProps {
  /** Current search value */
  value?: string
  /** Change callback */
  onChange?: (value: string) => void
  /** Search submit callback */
  onSearch?: (value: string) => void
  /** Error state */
  error?: boolean
  /** Error message */
  errorMessage?: string
  /** Placeholder */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Class name */
  className?: string
  /** Form field name */
  name?: string
  /** Size */
  size?: ComponentSize
  /** Show clear button */
  showClear?: boolean
  /** Show search button */
  showSearchButton?: boolean
  /** Search button text */
  searchButtonText?: string
  /** Debounce delay (ms) */
  debounceDelay?: number
}

const LMSearchInput = React.forwardRef<HTMLInputElement, LMSearchInputProps>(({
  value,
  onChange,
  onSearch,
  error = false,
  errorMessage,
  placeholder = 'Search...',
  disabled = false,
  className = '',
  name,
  size = 'md',
  showClear = true,
  showSearchButton = true,
  searchButtonText = 'Search',
  debounceDelay = 300,
}, ref) => {
  const [inputValue, setInputValue] = useState(value || '')
  const [isFocused, setIsFocused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const setRefs = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node
  }, [ref])
  const searchBtnRef = useRef<HTMLButtonElement>(null)
  const [searchBtnWidth, setSearchBtnWidth] = useState(0)

  useEffect(() => {
    if (value !== undefined && value !== null) setInputValue(value)
  }, [value])

  useEffect(() => {
    if (showSearchButton && searchBtnRef.current) {
      setSearchBtnWidth(searchBtnRef.current.offsetWidth || 0)
    } else {
      setSearchBtnWidth(0)
    }
  }, [showSearchButton, searchButtonText])

  const baseClassName = cn(
    'w-full',
    SIZE_INPUT_CONFIG[size].padding,
    SIZE_INPUT_CONFIG[size].height,
    'backdrop-blur-md border rounded-2xl',
    'focus:ring-2 focus:outline-none transition-all duration-300',
    'shadow-sm',
    showSearchButton ? 'pr-20' : showClear ? 'pr-10' : 'pr-4',
    'pl-12',
    className
  )

  const getSearchInputStyles = () => {
    const baseStyles = {
      backgroundColor: 'var(--lm-bg-elevated)',
      color: 'var(--lm-text-primary)',
      borderColor: error
        ? 'var(--lm-error-300)'
        : isFocused
          ? 'var(--lm-primary-400)'
          : 'var(--lm-border-default)',
      boxShadow: 'var(--lm-shadow-sm)',
    } as React.CSSProperties

    return {
      ...baseStyles,
      '--tw-ring-color': error
        ? 'var(--lm-error-400)'
        : 'var(--lm-primary-400)',
      '--tw-ring-opacity': '0.3',
    }
  }

  const getDisabledStyles = () =>
    disabled
      ? {
          backgroundColor: 'var(--lm-bg-paper)',
          color: 'var(--lm-text-disabled)',
          cursor: 'not-allowed',
          opacity: 0.6,
        }
      : {}

  const getIconStyles = () => {
    if (error) return { color: 'var(--lm-error-400)' }
    if (isFocused) return { color: 'var(--lm-primary-500)' }
    return { color: 'var(--lm-text-secondary)' }
  }

  const getButtonStyles = () => ({
    backgroundColor: 'var(--lm-primary-500)',
    color: 'white',
  })

  const getClearButtonStyles = () => ({
    backgroundColor: 'var(--lm-bg-paper)',
    color: 'var(--lm-text-secondary)',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setInputValue(newValue)
    onChange?.(newValue)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch?.(newValue)
    }, debounceDelay)
  }

  const handleSearch = () => onSearch?.(inputValue)

  const handleClear = () => {
    setInputValue('')
    onChange?.('')
    onSearch?.('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSearch()
    }
  }

  const clearBtnSizeClass =
    size === 'sm'
      ? 'w-7 h-7 text-xs'
      : size === 'lg'
        ? 'w-9 h-9 text-sm'
        : 'w-8 h-8 text-sm'

  const clearRightPx = showSearchButton ? searchBtnWidth + 8 : 8

  const SearchIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )

  const ClearIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  return (
    <div className="space-y-2">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <span style={getIconStyles()}>
            <SearchIcon />
          </span>
        </div>

        <input
          ref={setRefs}
          type="search"
          name={name}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          className={baseClassName}
          style={{
            ...getSearchInputStyles(),
            ...getDisabledStyles(),
          } as React.CSSProperties}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={(e) => {
            if (!disabled && !error && !isFocused) {
              e.currentTarget.style.borderColor = 'var(--lm-border-strong)'
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !error && !isFocused) {
              e.currentTarget.style.borderColor = 'var(--lm-border-default)'
            }
          }}
        />

        <style>{`
          input[type='search']::-webkit-search-cancel-button {
            -webkit-appearance: none;
            appearance: none;
          }
        `}</style>

        {showClear && inputValue && !disabled && (
          <button
            onClick={handleClear}
            className={`absolute top-1/2 -translate-y-1/2 z-10 rounded-full flex items-center justify-center ${clearBtnSizeClass}`}
            style={{
              ...getClearButtonStyles(),
              right: `${clearRightPx}px`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--lm-bg-elevated)'
              e.currentTarget.style.color = 'var(--lm-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--lm-bg-paper)'
              e.currentTarget.style.color = 'var(--lm-text-secondary)'
            }}
            aria-label="Clear"
            type="button"
          >
            <ClearIcon />
          </button>
        )}

        {showSearchButton && !disabled && (
          <button
            ref={searchBtnRef}
            onClick={handleSearch}
            className="absolute inset-y-0 right-0 px-4 rounded-r-2xl transition-colors duration-200 z-20"
            style={getButtonStyles()}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--lm-primary-600)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--lm-primary-500)'
            }}
            type="button"
          >
            <span className="text-sm font-medium">{searchButtonText}</span>
          </button>
        )}
      </div>

      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  )
})

LMSearchInput.displayName = 'LMSearchInput'

export default LMSearchInput
