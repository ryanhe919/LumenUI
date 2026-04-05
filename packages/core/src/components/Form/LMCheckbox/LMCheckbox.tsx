import React from 'react'
import { cn } from '../../../utils/cn'
import { SIZE_ICON_CONFIG } from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'
import { ErrorMessage } from '../../_internal/ErrorMessage'

export interface LMCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
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

const LMCheckbox: React.FC<LMCheckboxProps> = ({
  label,
  description,
  error = false,
  errorMessage,
  size = 'md',
  className = '',
  ...props
}) => {
  const currentSize = sizeConfig[size]
  const checkboxSizeClass = SIZE_ICON_CONFIG[size]

  const getCheckboxStyles = () => {
    const baseStyles = {
      backgroundColor: 'var(--lm-bg-elevated)',
      borderColor: error
        ? 'var(--lm-error-300)'
        : 'var(--lm-border-default)',
      color: 'var(--lm-primary-500)',
    }

    return {
      ...baseStyles,
      '--tw-ring-color': error
        ? 'var(--lm-error-400)'
        : 'var(--lm-primary-400)',
      '--tw-ring-opacity': '0.3',
    } as React.CSSProperties
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

  const getContainerStyles = () =>
    ({
      backgroundColor: error
        ? 'var(--lm-error-50)'
        : 'var(--lm-bg-paper)',
    }) as React.CSSProperties

  const getHoverContainerStyles = () =>
    ({
      backgroundColor: error
        ? 'var(--lm-error-100)'
        : 'var(--lm-bg-elevated)',
    }) as React.CSSProperties

  const getLabelStyles = () => {
    if (error)
      return { color: 'var(--lm-error-700)' } as React.CSSProperties
    if (props.disabled)
      return {
        color: 'var(--lm-text-disabled)',
        cursor: 'not-allowed',
      } as React.CSSProperties
    return {
      color: 'var(--lm-text-primary)',
      cursor: 'pointer',
    } as React.CSSProperties
  }

  const getDescriptionStyles = () =>
    (error
      ? { color: 'var(--lm-error-600)' }
      : { color: 'var(--lm-text-secondary)' }) as React.CSSProperties

  const checkboxClassName = cn(
    checkboxSizeClass,
    'border-2 rounded-md',
    'focus-visible:ring-2 focus-visible:ring-offset-0',
    'transition-all duration-200',
    className
  )

  return (
    <div>
      <label
        className={`flex items-center rounded-xl transition-colors duration-200 ${currentSize.container} ${
          props.disabled ? '' : 'cursor-pointer'
        }`}
        style={getContainerStyles()}
        onMouseEnter={(e) => {
          if (!props.disabled) {
            Object.assign(e.currentTarget.style, getHoverContainerStyles())
          }
        }}
        onMouseLeave={(e) => {
          if (!props.disabled) {
            Object.assign(e.currentTarget.style, getContainerStyles())
          }
        }}
      >
        <input
          type="checkbox"
          {...props}
          className={checkboxClassName}
          style={{
            ...getCheckboxStyles(),
            ...getDisabledStyles(),
          }}
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
          <span
            className={`font-medium leading-tight transition-colors duration-200 ${currentSize.label}`}
            style={getLabelStyles()}
          >
            {label}
          </span>
          {description && (
            <p
              className={currentSize.description}
              style={getDescriptionStyles()}
            >
              {description}
            </p>
          )}
        </div>
      </label>

      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  )
}

export default LMCheckbox
