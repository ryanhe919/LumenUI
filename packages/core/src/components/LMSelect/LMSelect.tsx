import React, { useState, useRef, useEffect } from 'react'
import { SIZE_SELECTOR_CONFIG } from '../../utils/componentSizes'
import type { ComponentSize } from '../../utils/componentSizes'

export interface LMSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface LMSelectProps {
  /** Options */
  options: LMSelectOption[]
  /** Current value */
  value?: string | number | (string | number)[]
  /** Change callback */
  onChange?: (value: string | number | (string | number)[]) => void
  /** Dropdown visibility change callback */
  onDropdownVisibleChange?: (visible: boolean) => void
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
  /** Multiple selection */
  multiple?: boolean
}

const SIZE_DROPDOWN_CONFIG: Record<
  ComponentSize,
  {
    maxHeight: string
    optionPadding: string
    optionTextSize: string
  }
> = {
  xs: { maxHeight: 'max-h-32', optionPadding: 'px-3 py-1.5', optionTextSize: 'text-xs' },
  sm: { maxHeight: 'max-h-40', optionPadding: 'px-3 py-2', optionTextSize: 'text-xs' },
  md: { maxHeight: 'max-h-48', optionPadding: 'px-4 py-2.5', optionTextSize: 'text-sm' },
  lg: { maxHeight: 'max-h-56', optionPadding: 'px-4 py-3', optionTextSize: 'text-sm' },
  xl: { maxHeight: 'max-h-64', optionPadding: 'px-5 py-3', optionTextSize: 'text-base' },
  '2xl': { maxHeight: 'max-h-72', optionPadding: 'px-6 py-4', optionTextSize: 'text-lg' },
}

const LMSelect: React.FC<LMSelectProps> = ({
  options,
  value,
  onChange,
  onDropdownVisibleChange,
  error = false,
  errorMessage,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  name,
  size = 'md',
  multiple = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<LMSelectOption | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<LMSelectOption[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!multiple) {
      if (value !== undefined && value !== null && !Array.isArray(value)) {
        const option = options.find((opt) => opt.value === value)
        setSelectedOption(option || null)
      } else {
        setSelectedOption(null)
      }
    }
  }, [value, options, multiple])

  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      const selectedOpts = options.filter((opt) => value.includes(opt.value))
      setSelectedOptions(selectedOpts)
    } else if (multiple) {
      setSelectedOptions([])
    }
  }, [value, options, multiple])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onDropdownVisibleChange?.(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onDropdownVisibleChange])

  const handleSelect = (option: LMSelectOption) => {
    if (option.disabled) return

    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      const isSelected = currentValues.includes(option.value)
      const newValues = isSelected
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value]
      onChange?.(newValues)
    } else {
      setSelectedOption(option)
      onChange?.(option.value)
      setIsOpen(false)
      onDropdownVisibleChange?.(false)
    }
  }

  const toggleDropdown = () => {
    if (!disabled) {
      const newIsOpen = !isOpen
      setIsOpen(newIsOpen)
      onDropdownVisibleChange?.(newIsOpen)
    }
  }

  const baseClassName = `
    w-full ${SIZE_SELECTOR_CONFIG[size].padding} ${SIZE_SELECTOR_CONFIG[size].height} ${SIZE_SELECTOR_CONFIG[size].fontSize}
    backdrop-blur-md border rounded-2xl
    transition-all duration-300 shadow-sm cursor-pointer
    flex items-center justify-between
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const getSelectorStyles = () => {
    const baseStyles = {
      backgroundColor: 'var(--lm-bg-elevated)',
      color: 'var(--lm-text-primary)',
      borderColor: error ? 'var(--lm-error-300)' : 'var(--lm-border-default)',
      boxShadow: 'var(--lm-shadow-sm)',
    }

    return {
      ...baseStyles,
      '--tw-ring-color': error ? 'var(--lm-error-400)' : 'var(--lm-primary-400)',
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

  const getIconStyles = () =>
    error ? { color: 'var(--lm-error-400)' } : { color: 'var(--lm-text-secondary)' }

  const getDropdownStyles = () => ({
    backgroundColor: 'var(--lm-bg-elevated)',
    borderColor: 'var(--lm-border-default)',
    boxShadow: 'var(--lm-shadow-lg)',
  })

  const isOptionSelected = (optionValue: string | number): boolean => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue)
    }
    return selectedOption?.value === optionValue
  }

  const getOptionStyles = (option: LMSelectOption) => {
    const baseStyles = {
      color: option.disabled ? 'var(--lm-text-disabled)' : 'var(--lm-text-primary)',
      backgroundColor: option.disabled ? 'var(--lm-bg-paper)' : 'transparent',
    }

    if (isOptionSelected(option.value)) {
      return {
        ...baseStyles,
        backgroundColor: 'var(--lm-primary-50)',
        color: 'var(--lm-primary-700)',
      }
    }

    return baseStyles
  }

  const getHoverOptionStyles = (option: LMSelectOption) => {
    if (option.disabled) return {}

    if (isOptionSelected(option.value)) {
      return { backgroundColor: 'var(--lm-primary-100)' }
    }

    return { backgroundColor: 'var(--lm-bg-paper)' }
  }

  const getDisplayText = (): string => {
    if (multiple) {
      if (selectedOptions.length === 0) return placeholder
      if (selectedOptions.length === 1) return selectedOptions[0].label
      return `${selectedOptions.length} selected`
    }
    return selectedOption ? selectedOption.label : placeholder
  }

  const ChevronDown = () => (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={getIconStyles()}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )

  const CheckIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <select
        name={name}
        value={
          multiple
            ? Array.isArray(value)
              ? value.map(String)
              : []
            : value !== undefined && value !== null && !Array.isArray(value)
              ? String(value)
              : ''
        }
        onChange={() => {}}
        className="sr-only"
        disabled={disabled}
        tabIndex={-1}
        multiple={multiple}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      <div
        className={baseClassName}
        onClick={toggleDropdown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        style={{
          ...getSelectorStyles(),
          ...getDisabledStyles(),
        } as React.CSSProperties}
        onMouseEnter={(e) => {
          if (!disabled && !error) {
            e.currentTarget.style.borderColor = 'var(--lm-border-strong)'
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !error) {
            e.currentTarget.style.borderColor = 'var(--lm-border-default)'
          }
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = error
              ? 'var(--lm-error-400)'
              : 'var(--lm-primary-400)'
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = error
              ? 'var(--lm-error-300)'
              : 'var(--lm-border-default)'
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleDropdown()
          }
        }}
      >
        <span
          style={{
            color:
              (multiple && selectedOptions.length > 0) || selectedOption
                ? 'var(--lm-text-primary)'
                : 'var(--lm-text-secondary)',
          }}
        >
          {getDisplayText()}
        </span>
        <ChevronDown />
      </div>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-50 backdrop-blur-md border rounded-xl overflow-y-auto ${SIZE_DROPDOWN_CONFIG[size].maxHeight}`}
          style={{
            ...getDropdownStyles(),
            top: 'calc(100% + 4px)',
          }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`
                ${SIZE_DROPDOWN_CONFIG[size].optionPadding} ${SIZE_DROPDOWN_CONFIG[size].optionTextSize} font-medium
                cursor-pointer transition-all duration-150
                ${option.disabled ? 'cursor-not-allowed' : ''}
                ${index === 0 ? 'rounded-t-xl' : ''}
                ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                ${index > 0 ? 'border-t' : ''}
              `}
              style={{
                ...getOptionStyles(option),
                borderTopColor: index > 0 ? 'var(--lm-border-light)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!option.disabled) {
                  Object.assign(e.currentTarget.style, getHoverOptionStyles(option))
                }
              }}
              onMouseLeave={(e) => {
                if (!option.disabled) {
                  Object.assign(e.currentTarget.style, getOptionStyles(option))
                }
              }}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={isOptionSelected(option.value)}
            >
              <div className="flex items-center justify-between">
                {multiple && (
                  <input
                    type="checkbox"
                    checked={isOptionSelected(option.value)}
                    onChange={() => {}}
                    className="mr-2 cursor-pointer"
                    style={{ accentColor: 'var(--lm-primary-500)' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <span className="truncate flex-1">{option.label}</span>
                {!multiple && isOptionSelected(option.value) && (
                  <span className="ml-2 flex-shrink-0" style={{ color: 'var(--lm-primary-600)' }}>
                    <CheckIcon />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {errorMessage && (
        <p
          className="text-xs flex items-center gap-1 mt-2"
          style={{ color: 'var(--lm-error-500)' }}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default LMSelect
