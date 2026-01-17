import React, { useId } from 'react'
import { SIZE_ICON_CONFIG } from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'

export interface LMRadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text */
  label: string
  /** Description text */
  description?: string
  /** Error state */
  error?: boolean
  /** Error message */
  errorMessage?: string
  /** Size */
  size?: ComponentSize
}

const sizeConfig = {
  xs: {
    container: 'p-2 gap-2',
    label: 'text-xs',
    description: 'text-xs mt-0.5',
    errorMessage: 'text-xs',
  },
  sm: {
    container: 'p-3 gap-2.5',
    label: 'text-sm',
    description: 'text-xs mt-1',
    errorMessage: 'text-xs',
  },
  md: {
    container: 'p-4 gap-3',
    label: 'text-base',
    description: 'text-sm mt-1',
    errorMessage: 'text-xs',
  },
  lg: {
    container: 'p-5 gap-4',
    label: 'text-lg',
    description: 'text-base mt-1.5',
    errorMessage: 'text-sm',
  },
  xl: {
    container: 'p-6 gap-4',
    label: 'text-xl',
    description: 'text-lg mt-2',
    errorMessage: 'text-sm',
  },
  '2xl': {
    container: 'p-8 gap-5',
    label: 'text-2xl',
    description: 'text-xl mt-2.5',
    errorMessage: 'text-base',
  },
}

const LMRadio: React.FC<LMRadioProps> = ({
  label,
  description,
  error = false,
  errorMessage,
  size = 'md',
  className = '',
  id,
  ...props
}) => {
  const autoId = useId()
  const controlId = id ?? `lm-radio-${autoId}`
  const errId = `lm-radio-err-${autoId}`

  const currentSize = sizeConfig[size]
  const radioSizeClass = SIZE_ICON_CONFIG[size]

  const getRadioStyles = () => {
    const baseStyles = {
      backgroundColor: 'var(--lm-bg-elevated)',
      borderColor: error
        ? 'var(--lm-error-300)'
        : 'var(--lm-border-default)',
      color: 'var(--lm-primary-500)',
    } as React.CSSProperties

    return {
      ...baseStyles,
      '--tw-ring-color': error
        ? 'var(--lm-error-400)'
        : 'var(--lm-primary-400)',
      '--tw-ring-opacity': '0.3',
    }
  }

  const getDisabledStyles = () => {
    if (props.disabled) {
      return {
        backgroundColor: 'var(--lm-bg-paper)',
        borderColor: 'var(--lm-border-light)',
        color: 'var(--lm-text-disabled)',
        cursor: 'not-allowed',
        opacity: 0.6,
      } as React.CSSProperties
    }
    return {}
  }

  const getContainerStyles = () => {
    const base = { backgroundColor: 'var(--lm-bg-paper)' }
    return error ? { ...base, backgroundColor: 'var(--lm-error-50)' } : base
  }

  const getHoverContainerStyles = () =>
    error
      ? { backgroundColor: 'var(--lm-error-100)' }
      : { backgroundColor: 'var(--lm-bg-elevated)' }

  const getLabelStyles = () => {
    if (error) return { color: 'var(--lm-error-700)' }
    if (props.disabled)
      return { color: 'var(--lm-text-disabled)', cursor: 'not-allowed' }
    return { color: 'var(--lm-text-primary)', cursor: 'pointer' }
  }

  const getDescriptionStyles = () =>
    error
      ? { color: 'var(--lm-error-600)' }
      : { color: 'var(--lm-text-secondary)' }

  const radioClassName = `
    ${radioSizeClass} border-2 rounded-full
    focus:ring-2 focus:ring-offset-0
    transition-all duration-200
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  return (
    <div>
      <div
        className={`flex items-start ${currentSize.container} rounded-2xl transition-colors duration-200`}
        style={getContainerStyles()}
        onMouseEnter={(e) => {
          if (!props.disabled)
            Object.assign(e.currentTarget.style, getHoverContainerStyles())
        }}
        onMouseLeave={(e) => {
          if (!props.disabled)
            Object.assign(e.currentTarget.style, getContainerStyles())
        }}
      >
        <input
          type="radio"
          id={controlId}
          {...props}
          className={radioClassName}
          aria-invalid={error || undefined}
          aria-describedby={errorMessage ? errId : undefined}
          style={{ ...getRadioStyles(), ...getDisabledStyles() } as React.CSSProperties}
          onFocus={(e) => {
            if (!props.disabled) {
              e.currentTarget.style.borderColor = error
                ? 'var(--lm-error-400)'
                : 'var(--lm-primary-400)'
            }
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            if (!props.disabled) {
              e.currentTarget.style.borderColor = error
                ? 'var(--lm-error-300)'
                : 'var(--lm-border-default)'
            }
            props.onBlur?.(e)
          }}
        />

        <div className="flex-1">
          <label
            htmlFor={controlId}
            className={`${currentSize.label} font-medium transition-colors duration-200`}
            style={getLabelStyles()}
          >
            {label}
          </label>
          {description && (
            <p className={currentSize.description} style={getDescriptionStyles()}>
              {description}
            </p>
          )}
        </div>
      </div>

      {errorMessage && (
        <p
          id={errId}
          className={`${currentSize.errorMessage} flex items-center gap-1`}
          style={{ color: 'var(--lm-error-500)' }}
          role="alert"
          aria-live="polite"
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
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

export default LMRadio
