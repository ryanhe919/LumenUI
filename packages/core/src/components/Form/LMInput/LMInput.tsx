import React, { useId } from 'react'
import { cn } from '../../../utils/cn'
import { SIZE_INPUT_CONFIG } from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'
import { ErrorMessage } from '../../_internal/ErrorMessage'

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

/** Padding-left values (in px) when leftIcon is present, by size */
const ICON_PL: Record<ComponentSize, number> = {
  xxs: 28, xs: 32, sm: 36, md: 40, lg: 44, xl: 48, '2xl': 56,
}

/** Padding-right values (in px) when rightElement is present, by size */
const ICON_PR: Record<ComponentSize, number> = {
  xxs: 28, xs: 32, sm: 36, md: 40, lg: 44, xl: 48, '2xl': 56,
}

const LMInput = React.forwardRef<HTMLInputElement, LMInputProps>(({
  leftIcon,
  rightElement,
  error = false,
  errorMessage,
  className = '',
  size = 'md',
  includeSeconds = false,
  ...props
}, ref) => {
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
  const baseClassName = cn(
    'w-full',
    SIZE_INPUT_CONFIG[size].padding,
    SIZE_INPUT_CONFIG[size].paddingLeft,
    SIZE_INPUT_CONFIG[size].paddingRight,
    SIZE_INPUT_CONFIG[size].height,
    SIZE_INPUT_CONFIG[size].fontSize,
    'border rounded-xl',
    'focus-visible:ring-2 focus-visible:outline-none',
    className
  )

  const getInputStyles = () => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: 'var(--lm-bg-elevated)',
      color: 'var(--lm-text-primary)',
      borderColor: error
        ? 'var(--lm-error-300)'
        : 'var(--lm-border-default)',
      boxShadow: 'var(--lm-shadow-sm)',
      transition: 'all var(--lm-transition-fast) var(--lm-ease-out)',
    }

    // Use inline style for icon padding — immune to Tailwind CSS layer conflicts
    if (hasLeftIcon) {
      baseStyles.paddingLeft = `${ICON_PL[size]}px`
    }
    if (hasRightElement) {
      baseStyles.paddingRight = `${ICON_PR[size]}px`
    }

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
          ref={ref}
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

      {errorMessage && <ErrorMessage message={errorMessage} id={errorId} />}
    </div>
  )
})

LMInput.displayName = 'LMInput'

export default LMInput
