import React, { useId } from 'react'
import type { ComponentSize } from '../../utils/componentSizes'

export interface LMSwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text */
  label?: string
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
    track: 'w-7 h-4',
    thumb: 'w-2.5 h-2.5',
    translate: 'translate-x-3',
  },
  sm: {
    container: 'p-3 gap-2.5',
    label: 'text-sm',
    description: 'text-xs mt-1',
    errorMessage: 'text-xs',
    track: 'w-9 h-5',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
  },
  md: {
    container: 'p-4 gap-3',
    label: 'text-base',
    description: 'text-sm mt-1',
    errorMessage: 'text-xs',
    track: 'w-11 h-6',
    thumb: 'w-4 h-4',
    translate: 'translate-x-5',
  },
  lg: {
    container: 'p-5 gap-4',
    label: 'text-lg',
    description: 'text-base mt-1.5',
    errorMessage: 'text-sm',
    track: 'w-14 h-7',
    thumb: 'w-5 h-5',
    translate: 'translate-x-7',
  },
  xl: {
    container: 'p-6 gap-4',
    label: 'text-xl',
    description: 'text-lg mt-2',
    errorMessage: 'text-sm',
    track: 'w-16 h-8',
    thumb: 'w-6 h-6',
    translate: 'translate-x-8',
  },
  '2xl': {
    container: 'p-8 gap-5',
    label: 'text-2xl',
    description: 'text-xl mt-2.5',
    errorMessage: 'text-base',
    track: 'w-20 h-10',
    thumb: 'w-8 h-8',
    translate: 'translate-x-10',
  },
}

const LMSwitch: React.FC<LMSwitchProps> = ({
  label,
  description,
  error = false,
  errorMessage,
  size = 'md',
  id,
  ...props
}) => {
  const autoId = useId()
  const controlId = id ?? `lm-switch-${autoId}`
  const errId = `lm-switch-err-${autoId}`

  const currentSize = sizeConfig[size]

  const getTrackBg = () => {
    if (props.disabled) return 'var(--lm-bg-paper)'
    if (error && !props.checked) return 'var(--lm-error-300)'
    if (props.checked) return 'var(--lm-primary-500)'
    return 'var(--lm-border-default)'
  }

  const getDisabledStyles = () => {
    if (props.disabled) {
      return {
        opacity: 0.6,
        cursor: 'not-allowed',
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

  return (
    <div>
      <label
        htmlFor={controlId}
        className={`flex items-start rounded-2xl transition-colors duration-200 ${currentSize.container} ${
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
        <div className="flex-shrink-0 relative">
          <input
            type="checkbox"
            id={controlId}
            {...props}
            className="sr-only peer"
            aria-invalid={error || undefined}
            aria-describedby={errorMessage ? errId : undefined}
            style={getDisabledStyles()}
          />
          <div
            className={`${currentSize.track} rounded-full transition-all duration-300 relative`}
            style={{
              backgroundColor: getTrackBg(),
              ...getDisabledStyles(),
            }}
          >
            <div
              className={`${currentSize.thumb} absolute left-1 top-1/2 -translate-y-1/2 rounded-full transition-transform duration-300 ${
                props.checked ? currentSize.translate : 'translate-x-0'
              }`}
              style={{
                backgroundColor: 'var(--lm-bg-elevated)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <span
                className={`font-medium leading-tight transition-colors duration-200 ${currentSize.label}`}
                style={getLabelStyles()}
              >
                {label}
              </span>
            )}
            {description && (
              <p
                className={currentSize.description}
                style={getDescriptionStyles()}
              >
                {description}
              </p>
            )}
          </div>
        )}
      </label>

      {errorMessage && (
        <p
          id={errId}
          className={`flex items-center gap-1 mt-2 ${currentSize.errorMessage}`}
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

export default LMSwitch
