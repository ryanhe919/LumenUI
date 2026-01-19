import React, { memo } from 'react'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_GAP_CLASSES,
  SIZE_TEXT_CLASSES,
  SIZE_BUTTON_CONFIG,
  clampComponentSize,
} from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'

const LoadingSpinner: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    style={style}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

export type LMButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning'

export interface LMButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: LMButtonVariant
  /** Size */
  size?: ComponentSize
  /** Loading state */
  loading?: boolean
  /** Loading text */
  loadingText?: string
  /** Left icon */
  leftIcon?: React.ReactNode
  /** Right icon */
  rightIcon?: React.ReactNode
  /** Full width */
  fullWidth?: boolean
  /** Full rounded */
  rounded?: boolean
}

const LMButton: React.FC<LMButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)

  // Apple-like refined border radius (12px default, full for pill)
  const roundedClasses = rounded ? 'rounded-full' : 'rounded-xl'
  const widthClasses = fullWidth ? 'w-full' : ''

  // Apple-like base styling with refined transitions
  const baseClassName = `
    ${SIZE_BUTTON_CONFIG[resolvedSize].padding} ${SIZE_TEXT_CLASSES[resolvedSize]} ${SIZE_GAP_CLASSES[resolvedSize]}
    ${roundedClasses} ${widthClasses}
    border font-medium
    focus:ring-2 focus:ring-offset-0 focus:outline-none
    disabled:cursor-not-allowed
    flex items-center justify-center
    cursor-pointer select-none
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const getButtonStyles = () => {
    // Apple-like base styles with refined shadows and transitions
    const baseStyles = {
      backgroundColor: 'var(--lm-bg-elevated)',
      color: 'var(--lm-text-primary)',
      borderColor: 'var(--lm-border-default)',
      boxShadow: 'var(--lm-shadow-sm)',
      transition: 'all var(--lm-transition-normal) var(--lm-ease-out)',
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-primary-500)',
          color: 'white',
          borderColor: 'transparent',
          boxShadow: 'var(--lm-shadow-md)',
          '--tw-ring-color': 'var(--lm-primary-400)',
          '--tw-ring-opacity': '0.4',
        }
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-bg-elevated)',
          color: 'var(--lm-text-primary)',
          borderColor: 'var(--lm-border-default)',
          '--tw-ring-color': 'var(--lm-primary-400)',
          '--tw-ring-opacity': '0.3',
        }
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: 'var(--lm-primary-500)',
          borderColor: 'var(--lm-primary-400)',
          boxShadow: 'none',
          '--tw-ring-color': 'var(--lm-primary-400)',
          '--tw-ring-opacity': '0.3',
        }
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: 'var(--lm-text-primary)',
          borderColor: 'transparent',
          boxShadow: 'none',
          '--tw-ring-color': 'var(--lm-primary-400)',
          '--tw-ring-opacity': '0.3',
        }
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-error-500)',
          color: 'white',
          borderColor: 'transparent',
          boxShadow: 'var(--lm-shadow-md)',
          '--tw-ring-color': 'var(--lm-error-400)',
          '--tw-ring-opacity': '0.4',
        }
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-success-500)',
          color: 'white',
          borderColor: 'transparent',
          boxShadow: 'var(--lm-shadow-md)',
          '--tw-ring-color': 'var(--lm-success-400)',
          '--tw-ring-opacity': '0.4',
        }
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-warning-500)',
          color: 'white',
          borderColor: 'transparent',
          boxShadow: 'var(--lm-shadow-md)',
          '--tw-ring-color': 'var(--lm-warning-400)',
          '--tw-ring-opacity': '0.4',
        }
      default:
        return baseStyles
    }
  }

  const getDisabledStyles = () => {
    if (isDisabled) {
      return {
        backgroundColor: 'var(--lm-bg-paper)',
        color: 'var(--lm-text-disabled)',
        borderColor: 'var(--lm-border-light)',
        cursor: 'not-allowed',
        opacity: 0.6,
      }
    }
    return {}
  }

  // Apple-like subtle hover with scale effect
  const getHoverStyles = () => {
    if (isDisabled) return {}

    const baseHover = {
      transform: 'scale(1.02)',
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseHover,
          backgroundColor: 'var(--lm-primary-600)',
          boxShadow: 'var(--lm-shadow-lg)',
        }
      case 'secondary':
        return {
          ...baseHover,
          backgroundColor: 'var(--lm-bg-hover)',
          borderColor: 'var(--lm-border-strong)',
        }
      case 'outline':
        return {
          ...baseHover,
          backgroundColor: 'var(--lm-primary-50)',
          borderColor: 'var(--lm-primary-500)',
        }
      case 'ghost':
        return {
          ...baseHover,
          backgroundColor: 'var(--lm-bg-hover)',
        }
      case 'danger':
        return {
          ...baseHover,
          backgroundColor: 'var(--lm-error-600)',
          boxShadow: 'var(--lm-shadow-lg)',
        }
      case 'success':
        return {
          ...baseHover,
          backgroundColor: 'var(--lm-success-600)',
          boxShadow: 'var(--lm-shadow-lg)',
        }
      case 'warning':
        return {
          ...baseHover,
          backgroundColor: 'var(--lm-warning-600)',
          boxShadow: 'var(--lm-shadow-lg)',
        }
      default:
        return baseHover
    }
  }

  // Apple-like pressed state with scale down
  const getActiveStyles = () => {
    if (isDisabled) return {}

    const baseActive = {
      transform: 'scale(0.98)',
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseActive,
          backgroundColor: 'var(--lm-primary-700)',
        }
      case 'secondary':
        return {
          ...baseActive,
          backgroundColor: 'var(--lm-bg-active)',
        }
      case 'outline':
        return {
          ...baseActive,
          backgroundColor: 'var(--lm-primary-100)',
        }
      case 'ghost':
        return {
          ...baseActive,
          backgroundColor: 'var(--lm-bg-active)',
        }
      case 'danger':
        return {
          ...baseActive,
          backgroundColor: 'var(--lm-error-700)',
        }
      case 'success':
        return {
          ...baseActive,
          backgroundColor: 'var(--lm-success-700)',
        }
      case 'warning':
        return {
          ...baseActive,
          backgroundColor: 'var(--lm-warning-700)',
        }
      default:
        return baseActive
    }
  }

  const getIconStyles = () => {
    if (isDisabled) {
      return { color: 'var(--lm-text-disabled)' }
    }
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'success':
      case 'warning':
        return { color: 'white' }
      case 'outline':
        return { color: 'var(--lm-primary-600)' }
      default:
        return { color: 'var(--lm-text-primary)' }
    }
  }

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={baseClassName}
      style={{
        ...getButtonStyles(),
        ...getDisabledStyles(),
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        if (!isDisabled) Object.assign(e.currentTarget.style, getHoverStyles())
        props.onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        if (!isDisabled)
          Object.assign(e.currentTarget.style, {
            ...getButtonStyles(),
            ...getDisabledStyles(),
          })
        props.onMouseLeave?.(e)
      }}
      onMouseDown={(e) => {
        if (!isDisabled) Object.assign(e.currentTarget.style, getActiveStyles())
        props.onMouseDown?.(e)
      }}
      onMouseUp={(e) => {
        if (!isDisabled) Object.assign(e.currentTarget.style, getHoverStyles())
        props.onMouseUp?.(e)
      }}
      onFocus={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.borderColor = 'var(--lm-primary-400)'
        }
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        if (!isDisabled)
          Object.assign(e.currentTarget.style, {
            ...getButtonStyles(),
            ...getDisabledStyles(),
          })
        props.onBlur?.(e)
      }}
    >
      {loading ? (
        <>
          <LoadingSpinner style={getIconStyles()} />
          {loadingText || children}
        </>
      ) : (
        <>
          {leftIcon && <span style={getIconStyles()}>{leftIcon}</span>}
          <span className="inline-flex items-center">{children}</span>
          {rightIcon && <span style={getIconStyles()}>{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

export default memo(LMButton)
