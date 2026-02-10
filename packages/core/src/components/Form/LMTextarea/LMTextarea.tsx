import React from 'react'
import { cn } from '../../../utils/cn'
import type { ComponentSize } from '../../../utils/componentSizes'
import { ErrorMessage } from '../../_internal/ErrorMessage'

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

const LMTextarea = React.forwardRef<HTMLTextAreaElement, LMTextareaProps>(({
  error = false,
  errorMessage,
  className = '',
  size = 'md',
  ...props
}, ref) => {
  const baseClassName = cn(
    'w-full',
    sizeConfig[size].padding,
    sizeConfig[size].fontSize,
    'backdrop-blur-md border rounded-2xl',
    'focus:ring-2 focus:outline-none transition-all duration-300',
    'shadow-sm resize-none',
    !className.includes('h-full') && sizeConfig[size].minHeight,
    className
  )

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
        ref={ref}
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
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  )
})

LMTextarea.displayName = 'LMTextarea'

export default LMTextarea
