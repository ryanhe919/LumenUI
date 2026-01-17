import React from 'react'
import type { ComponentSize } from '../../../utils/componentSizes'

export interface LMTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state */
  error?: boolean
  /** Error message */
  errorMessage?: string
  /** Size */
  size?: ComponentSize
}

const sizeConfig = {
  xs: {
    minHeight: 'min-h-[60px]',
    fontSize: 'text-xs',
    padding: 'px-3 py-2',
  },
  sm: {
    minHeight: 'min-h-[80px]',
    fontSize: 'text-sm',
    padding: 'px-3 py-2',
  },
  md: {
    minHeight: 'min-h-[100px]',
    fontSize: 'text-sm',
    padding: 'px-4 py-2.5',
  },
  lg: {
    minHeight: 'min-h-[120px]',
    fontSize: 'text-base',
    padding: 'px-4 py-3',
  },
  xl: {
    minHeight: 'min-h-[140px]',
    fontSize: 'text-base',
    padding: 'px-5 py-3.5',
  },
  '2xl': {
    minHeight: 'min-h-[160px]',
    fontSize: 'text-lg',
    padding: 'px-6 py-4',
  },
}

const LMTextarea: React.FC<LMTextareaProps> = ({
  error = false,
  errorMessage,
  className = '',
  size = 'md',
  ...props
}) => {
  const baseClassName = `
    w-full ${sizeConfig[size].padding} ${sizeConfig[size].fontSize} backdrop-blur-md border rounded-2xl
    focus:ring-2 focus:outline-none transition-all duration-300
    shadow-sm resize-none ${className.includes('h-full') ? '' : sizeConfig[size].minHeight}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const getTextareaStyles = () => {
    const baseStyles = {
      backgroundColor: 'var(--lm-bg-elevated)',
      color: 'var(--lm-text-primary)',
      borderColor: error
        ? 'var(--lm-error-300)'
        : 'var(--lm-border-default)',
      boxShadow: 'var(--lm-shadow-sm)',
    }

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
        color: 'var(--lm-text-disabled)',
        cursor: 'not-allowed',
        opacity: 0.6,
      }
    }
    return {}
  }

  const isFullHeight = className.includes('h-full')
  const containerClassName = isFullHeight
    ? 'h-full flex flex-col'
    : 'space-y-2'

  return (
    <div className={containerClassName}>
      <textarea
        {...props}
        className={baseClassName}
        style={{
          ...getTextareaStyles(),
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
      {errorMessage && (
        <p
          className="text-xs flex items-center gap-1"
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

export default LMTextarea
