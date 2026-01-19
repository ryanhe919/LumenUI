import React, { useId } from 'react'
import { SIZE_INPUT_CONFIG } from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'

export interface LMInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Left icon */
  leftIcon?: React.ReactNode
  /** Right element */
  rightElement?: React.ReactNode
  /** Error state */
  error?: boolean
  /** Error message */
  errorMessage?: string
  /** Size */
  size?: ComponentSize
  /** Include seconds for time inputs */
  includeSeconds?: boolean
}

const LMInput: React.FC<LMInputProps> = ({
  leftIcon,
  rightElement,
  error = false,
  errorMessage,
  className = '',
  size = 'md',
  includeSeconds = false,
  ...props
}) => {
  const hasLeftIcon = !!leftIcon
  const hasRightElement = !!rightElement
  const errorId = `lm-input-err-${useId()}`

  const timeInputProps = () => {
    if (
      (props.type === 'datetime-local' || props.type === 'time') &&
      includeSeconds
    ) {
      return { step: '1' as const }
    }
    return {}
  }

  // Apple-like refined input styling
  const baseClassName = `
    w-full ${SIZE_INPUT_CONFIG[size].padding} ${SIZE_INPUT_CONFIG[size].height} ${SIZE_INPUT_CONFIG[size].fontSize}
    border rounded-xl
    focus:ring-2 focus:outline-none
    ${hasLeftIcon ? 'pl-10' : ''}
    ${hasRightElement ? 'pr-10' : ''}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const getInputStyles = () => {
    // Apple-like refined input styles
    const baseStyles = {
      backgroundColor: 'var(--lm-bg-elevated)',
      color: 'var(--lm-text-primary)',
      borderColor: error
        ? 'var(--lm-error-300)'
        : 'var(--lm-border-default)',
      boxShadow: 'var(--lm-shadow-sm)',
      transition: 'all var(--lm-transition-fast) var(--lm-ease-out)',
    } as React.CSSProperties

    return {
      ...baseStyles,
      '--tw-ring-color': error
        ? 'var(--lm-error-400)'
        : 'var(--lm-primary-400)',
      '--tw-ring-opacity': '0.4',
    }
  }

  const getDisabledStyles = () =>
    props.disabled
      ? {
          backgroundColor: 'var(--lm-bg-paper)',
          color: 'var(--lm-text-disabled)',
          cursor: 'not-allowed',
          opacity: 0.6,
        }
      : {}

  const getIconStyles = () =>
    error
      ? { color: 'var(--lm-error-400)' }
      : { color: 'var(--lm-text-secondary)' }

  return (
    <div className="space-y-2">
      <div className="relative group">
        {hasLeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <div
              className="transition-colors duration-200"
              style={getIconStyles()}
            >
              {leftIcon}
            </div>
          </div>
        )}

        <input
          {...props}
          {...timeInputProps()}
          className={baseClassName}
          aria-invalid={error || undefined}
          aria-describedby={errorMessage ? errorId : undefined}
          style={{
            ...getInputStyles(),
            ...getDisabledStyles(),
          } as React.CSSProperties}
          onMouseEnter={(e) => {
            if (!props.disabled && !error) {
              e.currentTarget.style.borderColor = 'var(--lm-border-strong)'
            }
            props.onMouseEnter?.(e)
          }}
          onMouseLeave={(e) => {
            if (!props.disabled && !error) {
              e.currentTarget.style.borderColor = 'var(--lm-border-default)'
            }
            props.onMouseLeave?.(e)
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

        {hasRightElement && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center z-10">
            {rightElement}
          </div>
        )}
      </div>

      {errorMessage && (
        <p
          id={errorId}
          className="text-xs flex items-center gap-1"
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

export default LMInput
