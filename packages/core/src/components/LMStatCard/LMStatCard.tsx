import React from 'react'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_GAP_CLASSES,
  SIZE_PADDING_CLASSES,
  clampComponentSize,
} from '../../utils/componentSizes'
import type { ComponentSize } from '../../utils/componentSizes'

export interface LMStatCardProps {
  /** Title */
  title: string
  /** Value */
  value: string | number
  /** Description text */
  description?: string
  /** Left icon */
  icon?: React.ReactNode
  /** Trend value (percentage, positive/negative indicates direction; 0 means flat) */
  trend?: number
  /** Trend description text */
  trendText?: string
  /** Visual variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  /** Size */
  size?: ComponentSize
  /** Clickable */
  clickable?: boolean
  /** Click event */
  onClick?: () => void
  /** Class name */
  className?: string
  /** Value prefix (e.g., $) */
  prefix?: string
  /** Value suffix (e.g., %, times) */
  suffix?: string
  /** Show border */
  bordered?: boolean
  /** Show shadow */
  shadow?: boolean
  /** Compact mode: uses smaller spacing and fonts when enabled */
  compact?: boolean
}

const ArrowUpIcon: React.FC = () => (
  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 10V2M6 2l4 4M6 2L2 6" />
  </svg>
)

const ArrowDownIcon: React.FC = () => (
  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2v8M6 10l4-4M6 10l-4-4" />
  </svg>
)

const MinusIcon: React.FC = () => (
  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6h8" />
  </svg>
)

const LMStatCard: React.FC<LMStatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendText,
  variant = 'default',
  size = 'md',
  clickable = false,
  onClick,
  className = '',
  prefix,
  suffix,
  bordered = true,
  shadow = true,
  compact = false,
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)

  const iconSizeClasses: Record<ComponentSize, string> = compact
    ? {
        xs: 'w-4 h-4',
        sm: 'w-5 h-5',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-10 h-10',
        '2xl': 'w-12 h-12',
      }
    : {
        xs: 'w-5 h-5',
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-14 h-14',
        '2xl': 'w-16 h-16',
      }

  const titleTextClasses: Record<ComponentSize, string> = compact
    ? {
        xs: 'text-[10px]',
        sm: 'text-[10px]',
        md: 'text-xs',
        lg: 'text-sm',
        xl: 'text-base',
        '2xl': 'text-lg',
      }
    : {
        xs: 'text-xs',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
        '2xl': 'text-xl',
      }

  const metaTextClasses: Record<ComponentSize, string> = compact
    ? {
        xs: 'text-[10px]',
        sm: 'text-[10px]',
        md: 'text-[10px]',
        lg: 'text-[10px]',
        xl: 'text-xs',
        '2xl': 'text-xs',
      }
    : {
        xs: 'text-xs',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-sm',
        xl: 'text-base',
        '2xl': 'text-lg',
      }

  const descriptionTextClasses: Record<ComponentSize, string> = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-xs',
    xl: 'text-xs',
    '2xl': 'text-xs',
  }

  const valueTextClasses: Record<ComponentSize, string> = compact
    ? {
        xs: 'text-sm',
        sm: 'text-base',
        md: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
        '2xl': 'text-3xl',
      }
    : {
        xs: 'text-lg',
        sm: 'text-xl',
        md: 'text-3xl',
        lg: 'text-4xl',
        xl: 'text-5xl',
        '2xl': 'text-6xl',
      }

  const roundedClasses = 'rounded-2xl'
  const borderClasses = bordered ? 'border' : ''
  const shadowClasses = shadow ? 'shadow-sm' : ''
  const clickableClasses = clickable ? 'cursor-pointer transition-transform hover:scale-105' : ''

  const baseClassName = `
    ${SIZE_PADDING_CLASSES[resolvedSize]} ${roundedClasses} ${borderClasses} ${shadowClasses} ${clickableClasses}
    backdrop-blur-md transition-all duration-300
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const getCardStyles = () => {
    const baseStyles = {
      backgroundColor: 'var(--lm-bg-elevated)',
      color: 'var(--lm-text-primary)',
      borderColor: 'var(--lm-border-default)',
      boxShadow: 'var(--lm-shadow-sm)',
    } as React.CSSProperties

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-primary-50)',
          borderColor: 'var(--lm-primary-200)',
        }
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-success-50)',
          borderColor: 'var(--lm-success-200)',
        }
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-warning-50)',
          borderColor: 'var(--lm-warning-200)',
        }
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-error-50)',
          borderColor: 'var(--lm-error-200)',
        }
      case 'info':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-gray-50)',
          borderColor: 'var(--lm-gray-200)',
        }
      default:
        return baseStyles
    }
  }

  const getHoverStyles = () => {
    if (!clickable) return {}
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--lm-primary-100)',
          borderColor: 'var(--lm-primary-300)',
          boxShadow: 'var(--lm-shadow-md)',
        }
      case 'success':
        return {
          backgroundColor: 'var(--lm-success-100)',
          borderColor: 'var(--lm-success-300)',
          boxShadow: 'var(--lm-shadow-md)',
        }
      case 'warning':
        return {
          backgroundColor: 'var(--lm-warning-100)',
          borderColor: 'var(--lm-warning-300)',
          boxShadow: 'var(--lm-shadow-md)',
        }
      case 'error':
        return {
          backgroundColor: 'var(--lm-error-100)',
          borderColor: 'var(--lm-error-300)',
          boxShadow: 'var(--lm-shadow-md)',
        }
      case 'info':
        return {
          backgroundColor: 'var(--lm-gray-100)',
          borderColor: 'var(--lm-gray-300)',
          boxShadow: 'var(--lm-shadow-md)',
        }
      default:
        return {
          backgroundColor: 'var(--lm-bg-paper)',
          borderColor: 'var(--lm-border-strong)',
          boxShadow: 'var(--lm-shadow-md)',
        }
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          color: 'var(--lm-primary-600)',
          backgroundColor: 'var(--lm-primary-100)',
        }
      case 'success':
        return {
          color: 'var(--lm-success-600)',
          backgroundColor: 'var(--lm-success-100)',
        }
      case 'warning':
        return {
          color: 'var(--lm-warning-600)',
          backgroundColor: 'var(--lm-warning-100)',
        }
      case 'error':
        return {
          color: 'var(--lm-error-600)',
          backgroundColor: 'var(--lm-error-100)',
        }
      case 'info':
        return {
          color: 'var(--lm-gray-600)',
          backgroundColor: 'var(--lm-gray-100)',
        }
      default:
        return {
          color: 'var(--lm-primary-600)',
          backgroundColor: 'var(--lm-bg-paper)',
        }
    }
  }

  const getValueStyles = () => {
    switch (variant) {
      case 'primary':
        return { color: 'var(--lm-primary-700)' }
      case 'success':
        return { color: 'var(--lm-success-700)' }
      case 'warning':
        return { color: 'var(--lm-warning-700)' }
      case 'error':
        return { color: 'var(--lm-error-700)' }
      case 'info':
        return { color: 'var(--lm-gray-700)' }
      default:
        return { color: 'var(--lm-text-primary)' }
    }
  }

  const getTrendStyles = () => {
    if (trend == null) return {}
    if (trend > 0) return { color: 'var(--lm-success-600)' }
    if (trend < 0) return { color: 'var(--lm-error-600)' }
    return { color: 'var(--lm-text-secondary)' }
  }

  const getTrendIcon = () => {
    if (trend == null) return null
    if (trend > 0) return <ArrowUpIcon />
    if (trend < 0) return <ArrowDownIcon />
    return <MinusIcon />
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!clickable) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className={baseClassName}
      style={getCardStyles()}
      onClick={clickable ? onClick : undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={(e) => {
        if (clickable) Object.assign(e.currentTarget.style, getHoverStyles())
      }}
      onMouseLeave={(e) => {
        if (clickable) Object.assign(e.currentTarget.style, getCardStyles())
      }}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? title : undefined}
    >
      <div className="flex items-start justify-between overflow-hidden">
        <div className="flex-1 min-w-0">
          {/* Title and icon */}
          <div className="flex items-center gap-2 mb-2 min-w-0">
            {icon && (
              <div
                className={`${iconSizeClasses[resolvedSize]} rounded-lg flex items-center justify-center flex-shrink-0`}
                style={getIconStyles()}
              >
                {icon}
              </div>
            )}
            <h3
              className={`${titleTextClasses[resolvedSize]} font-medium truncate`}
              style={{ color: 'var(--lm-text-secondary)' }}
              title={title}
            >
              {title}
            </h3>
          </div>

          {/* Value area (prefix/suffix) */}
          <div
            className={`flex items-baseline ${SIZE_GAP_CLASSES[resolvedSize]} min-w-0 overflow-hidden w-full`}
          >
            {prefix && (
              <span
                className={`${metaTextClasses[resolvedSize]} flex-shrink-0`}
                style={{ color: 'var(--lm-text-secondary)' }}
              >
                {prefix}
              </span>
            )}
            <span
              className={`font-bold ${valueTextClasses[resolvedSize]} overflow-hidden`}
              style={getValueStyles()}
            >
              {value}
            </span>
            {suffix && (
              <span
                className={`${metaTextClasses[resolvedSize]} flex-shrink-0`}
                style={{ color: 'var(--lm-text-secondary)' }}
              >
                {suffix}
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p
              className={`${descriptionTextClasses[resolvedSize]} mt-1 truncate`}
              style={{ color: 'var(--lm-text-secondary)' }}
              title={description}
            >
              {description}
            </p>
          )}

          {/* Trend area */}
          {(trend != null || trendText) && (
            <div className={`flex items-center ${SIZE_GAP_CLASSES[resolvedSize]} mt-2`}>
              {trend != null && (
                <div className="flex items-center gap-1" style={getTrendStyles()}>
                  {getTrendIcon()}
                  <span className="text-sm font-medium">{Math.abs(trend)}%</span>
                </div>
              )}
              {trendText && (
                <span className="text-sm" style={{ color: 'var(--lm-text-secondary)' }}>
                  {trendText}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LMStatCard
