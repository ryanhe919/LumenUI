import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import { SIZE_INPUT_CONFIG } from '../../utils/componentSizes'
import type { ComponentSize } from '../../utils/componentSizes'

export interface LMNumberInputProps {
  /** Current value (controlled) */
  value?: number | null
  /** Change callback */
  onChange?: (value: number | null) => void
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
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step */
  step?: number
  /** Decimal precision */
  precision?: number
  /** Show increment/decrement controls */
  showControls?: boolean
  /** Prefix text */
  prefix?: string
  /** Suffix text */
  suffix?: string
}

const LMNumberInput: React.FC<LMNumberInputProps> = ({
  value,
  onChange,
  error = false,
  errorMessage,
  placeholder = 'Enter number...',
  disabled = false,
  className = '',
  name,
  size = 'md',
  min,
  max,
  step = 1,
  precision = 0,
  showControls = true,
  prefix,
  suffix,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    value !== null && value !== undefined ? String(value) : ''
  )
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const errId = useRef(`lm-ni-err-${Math.random().toString(36).slice(2)}`).current

  const formatNumber = useCallback(
    (num: number): string => {
      if (!Number.isFinite(num)) return ''
      if (precision <= 0) return String(Math.round(num))
      return num.toFixed(precision)
    },
    [precision]
  )

  useEffect(() => {
    if (value === undefined || value === null) {
      setInputValue('')
    } else if (!isFocused) {
      setInputValue(formatNumber(value))
    }
  }, [value, isFocused, formatNumber])

  const baseClassName = `
    w-full ${SIZE_INPUT_CONFIG[size].padding} ${SIZE_INPUT_CONFIG[size].height} ${SIZE_INPUT_CONFIG[size].fontSize}
    backdrop-blur-md border rounded-2xl
    focus:ring-2 focus:outline-none transition-all duration-300
    shadow-sm
    ${showControls ? 'pr-10' : ''}
    ${prefix ? 'pl-10' : ''}
    ${suffix ? 'pr-10' : ''}
    ${className}
    [&::-webkit-outer-spin-button]:appearance-none
    [&::-webkit-inner-spin-button]:appearance-none
    [-moz-appearance:textfield]
  `
    .trim()
    .replace(/\s+/g, ' ')

  const getNumberInputStyles = () => {
    const base = {
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
      ...base,
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

  const getControlButtonStyles = () => ({
    backgroundColor: 'var(--lm-bg-paper)',
    color: 'var(--lm-text-secondary)',
    borderColor: 'var(--lm-border-light)',
  })

  const getHoverControlButtonStyles = () => ({
    backgroundColor: 'var(--lm-bg-elevated)',
    color: 'var(--lm-text-primary)',
  })

  const parseNumber = (str: string): number | null => {
    const n = parseFloat(str)
    return Number.isNaN(n) ? null : n
  }

  const clamp = (num: number): number => {
    let v = num
    if (min !== undefined) v = Math.max(v, min)
    if (max !== undefined) v = Math.min(v, max)
    return v
  }

  const stepFrom = useMemo(() => min ?? 0, [min])
  const alignToStep = (num: number) => {
    const offset = num - stepFrom
    const k = Math.round(offset / step)
    const next = stepFrom + k * step
    return Number(next.toFixed(Math.max(precision, 12)))
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value
    setInputValue(val)

    if (val.trim() === '') {
      onChange?.(null)
      return
    }

    const num = parseNumber(val)
    if (num === null) return

    const clamped = clamp(num)
    if (clamped !== num) return
    onChange?.(num)
  }

  const changeByStep = (delta: number) => {
    if (disabled) return

    const current = parseNumber(inputValue)
    const base = current ?? min ?? 0
    const raw = base + delta * step
    const clamped = clamp(raw)
    const aligned = alignToStep(clamped)

    setInputValue(formatNumber(aligned))
    onChange?.(aligned)
  }

  const handleIncrement = () => changeByStep(+1)
  const handleDecrement = () => changeByStep(-1)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      handleIncrement()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      handleDecrement()
    }
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => {
    setIsFocused(false)

    if (inputValue.trim() === '') {
      setInputValue('')
      if (value !== null) onChange?.(null)
      return
    }

    const num = parseNumber(inputValue)
    if (num === null) {
      if (typeof value === 'number') {
        setInputValue(formatNumber(clamp(value)))
      } else {
        setInputValue('')
        if (value !== null) onChange?.(null)
      }
      return
    }
    let v = clamp(num)
    v = alignToStep(v)
    const formatted = formatNumber(v)
    setInputValue(formatted)
    if (v !== value) onChange?.(v)
  }

  const handleWheel: React.WheelEventHandler<HTMLInputElement> = (e) => {
    if (document.activeElement === inputRef.current) {
      e.preventDefault()
    }
  }

  const currentNum = parseNumber(inputValue)
  const incDisabled = useMemo(() => {
    if (disabled) return true
    const base = currentNum ?? min ?? 0
    return max !== undefined && base >= max
  }, [disabled, currentNum, min, max])

  const decDisabled = useMemo(() => {
    if (disabled) return true
    const base = currentNum ?? min ?? 0
    return min !== undefined && base <= min
  }, [disabled, currentNum, min])

  const ChevronUp = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  )

  const ChevronDown = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )

  return (
    <div className="space-y-2">
      <div className="relative group">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <span className="text-sm font-medium" style={getIconStyles()}>
              {prefix}
            </span>
          </div>
        )}

        <input
          ref={inputRef}
          type="number"
          name={name}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          inputMode="decimal"
          className={baseClassName}
          style={{ ...getNumberInputStyles(), ...getDisabledStyles() } as React.CSSProperties}
          aria-invalid={error || undefined}
          aria-describedby={errorMessage ? errId : undefined}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onWheel={handleWheel}
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

        {suffix && (
          <div
            className={`absolute inset-y-0 flex items-center pointer-events-none z-10 ${
              showControls ? 'right-10' : 'right-4'
            }`}
          >
            <span className="text-sm font-medium" style={getIconStyles()}>
              {suffix}
            </span>
          </div>
        )}

        {showControls && (
          <div className="absolute inset-y-0 right-0 flex flex-col w-8">
            <button
              type="button"
              aria-label="Increment"
              onClick={handleIncrement}
              disabled={incDisabled}
              className="flex-1 px-1 border-l border-b rounded-tr-2xl transition-colors duration-200 flex items-center justify-center"
              style={getControlButtonStyles()}
              onMouseEnter={(e) => {
                if (!incDisabled)
                  Object.assign(e.currentTarget.style, getHoverControlButtonStyles())
              }}
              onMouseLeave={(e) => {
                if (!incDisabled)
                  Object.assign(e.currentTarget.style, getControlButtonStyles())
              }}
            >
              <ChevronUp />
            </button>
            <button
              type="button"
              aria-label="Decrement"
              onClick={handleDecrement}
              disabled={decDisabled}
              className="flex-1 px-1 border-l rounded-br-2xl transition-colors duration-200 flex items-center justify-center"
              style={getControlButtonStyles()}
              onMouseEnter={(e) => {
                if (!decDisabled)
                  Object.assign(e.currentTarget.style, getHoverControlButtonStyles())
              }}
              onMouseLeave={(e) => {
                if (!decDisabled)
                  Object.assign(e.currentTarget.style, getControlButtonStyles())
              }}
            >
              <ChevronDown />
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <p
          id={errId}
          className="text-xs flex items-center gap-1"
          style={{ color: 'var(--lm-error-500)' }}
          role="alert"
          aria-live="polite"
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

export default LMNumberInput
