import React, { useId } from 'react'
import { cn } from '../../../utils/cn'
import { SIZE_ICON_CONFIG } from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'
import { ErrorMessage } from '../../_internal/ErrorMessage'

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

  const radioClassName = cn(
    radioSizeClass,
    'border-2 rounded-full',
    'focus-visible:ring-2 focus-visible:ring-offset-0',
    'transition-all duration-200',
    className
  )

  return (
    <div>
      <div
        className={`flex items-start ${currentSize.container} rounded-xl transition-colors duration-200`}
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

      {errorMessage && <ErrorMessage message={errorMessage} id={errId} />}
    </div>
  )
}

export default LMRadio
