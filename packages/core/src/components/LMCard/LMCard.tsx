import React, { useState } from 'react'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_PADDING_CLASSES,
  SIZE_TEXT_CLASSES,
  SIZE_GAP_CLASSES,
  clampComponentSize,
} from '../../utils/componentSizes'
import type { ComponentSize } from '../../utils/componentSizes'

export interface LMCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Card title */
  title?: React.ReactNode
  /** Extra content in the top-right corner */
  extra?: React.ReactNode
  /** Card content */
  children: React.ReactNode
  /** Card size */
  size?: ComponentSize
  /** Show border */
  bordered?: boolean
  /** Hoverable effect */
  hoverable?: boolean
  /** Loading state - shows skeleton */
  loading?: boolean
  /** Cover image at top */
  cover?: React.ReactNode
  /** Actions at bottom */
  actions?: React.ReactNode[]
  /** Visual variant */
  variant?: 'default' | 'elevated' | 'outline' | 'soft'
  /** Custom class name */
  className?: string
}

const LMCard: React.FC<LMCardProps> = ({
  title,
  extra,
  children,
  size = 'md',
  bordered = true,
  hoverable = false,
  loading = false,
  cover,
  actions,
  variant = 'default',
  className = '',
  ...rest
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const [isHovered, setIsHovered] = useState(false)

  const titleTextClasses: Record<ComponentSize, string> = {
    xs: 'text-sm',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }

  const roundedClasses = 'rounded-2xl'
  const borderClasses = bordered ? 'border' : ''
  const hoverableClasses = hoverable ? 'cursor-pointer transition-all duration-300' : ''

  const baseClassName = `
    ${roundedClasses} ${borderClasses} ${hoverableClasses}
    backdrop-blur-md transition-all duration-300 overflow-hidden
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const getCardStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: 'var(--lm-bg-elevated)',
      borderColor: 'var(--lm-border-default)',
      boxShadow: 'var(--lm-shadow-sm)',
    }

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          boxShadow: 'var(--lm-shadow-lg)',
        }
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderColor: 'var(--lm-border-strong)',
          boxShadow: 'none',
        }
      case 'soft':
        return {
          ...baseStyles,
          backgroundColor: 'var(--lm-bg-paper)',
          borderColor: 'var(--lm-border-light)',
          boxShadow: 'none',
        }
      default:
        return baseStyles
    }
  }

  const getHoverStyles = (): React.CSSProperties => {
    if (!hoverable) return {}

    const baseHover: React.CSSProperties = {
      boxShadow: 'var(--lm-shadow-lg)',
      borderColor: 'var(--lm-border-strong)',
      transform: 'translateY(-2px)',
    }

    switch (variant) {
      case 'elevated':
        return {
          ...baseHover,
          boxShadow: 'var(--lm-shadow-xl)',
        }
      case 'outline':
        return {
          ...baseHover,
          backgroundColor: 'var(--lm-bg-hover)',
          boxShadow: 'var(--lm-shadow-md)',
        }
      case 'soft':
        return {
          ...baseHover,
          backgroundColor: 'var(--lm-bg-hover)',
          boxShadow: 'var(--lm-shadow-md)',
        }
      default:
        return baseHover
    }
  }

  const currentStyles = isHovered && hoverable ? { ...getCardStyles(), ...getHoverStyles() } : getCardStyles()

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="animate-pulse">
      {title && (
        <div className="mb-4">
          <div
            className="h-4 rounded w-1/3"
            style={{ backgroundColor: 'var(--lm-bg-active)' }}
          />
        </div>
      )}
      <div className="space-y-3">
        <div
          className="h-4 rounded w-full"
          style={{ backgroundColor: 'var(--lm-bg-active)' }}
        />
        <div
          className="h-4 rounded w-5/6"
          style={{ backgroundColor: 'var(--lm-bg-active)' }}
        />
        <div
          className="h-4 rounded w-4/6"
          style={{ backgroundColor: 'var(--lm-bg-active)' }}
        />
      </div>
    </div>
  )

  // Header section
  const renderHeader = () => {
    if (!title && !extra) return null

    return (
      <div
        className={`flex items-center justify-between ${SIZE_GAP_CLASSES[resolvedSize]} border-b`}
        style={{
          borderColor: 'var(--lm-border-light)',
          padding: `${SIZE_PADDING_CLASSES[resolvedSize].split(' ')[0].replace('px-', '')}rem ${SIZE_PADDING_CLASSES[resolvedSize].split(' ')[1]?.replace('py-', '') || '1'}rem`,
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
        }}
      >
        {title && (
          <div
            className={`${titleTextClasses[resolvedSize]} font-semibold`}
            style={{ color: 'var(--lm-text-primary)' }}
          >
            {title}
          </div>
        )}
        {extra && (
          <div
            className={SIZE_TEXT_CLASSES[resolvedSize]}
            style={{ color: 'var(--lm-text-secondary)' }}
          >
            {extra}
          </div>
        )}
      </div>
    )
  }

  // Actions section
  const renderActions = () => {
    if (!actions || actions.length === 0) return null

    return (
      <div
        className="flex items-center border-t"
        style={{ borderColor: 'var(--lm-border-light)' }}
      >
        {actions.map((action, index) => (
          <div
            key={index}
            className={`flex-1 flex items-center justify-center py-3 transition-colors duration-200 hover:bg-[var(--lm-bg-hover)] ${
              index !== actions.length - 1 ? 'border-r' : ''
            }`}
            style={{
              borderColor: 'var(--lm-border-light)',
              color: 'var(--lm-text-secondary)',
            }}
          >
            {action}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={baseClassName}
      style={currentStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {/* Cover image */}
      {cover && (
        <div className="w-full overflow-hidden">
          {cover}
        </div>
      )}

      {/* Header */}
      {renderHeader()}

      {/* Body */}
      <div className={SIZE_PADDING_CLASSES[resolvedSize]}>
        {loading ? renderSkeleton() : children}
      </div>

      {/* Actions */}
      {renderActions()}
    </div>
  )
}

export default LMCard
