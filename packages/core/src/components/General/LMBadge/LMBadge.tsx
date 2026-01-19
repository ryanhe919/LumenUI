import React from 'react'

export type LMBadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

export type LMBadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface LMBadgeProps {
  /** Badge content */
  children: React.ReactNode
  /** Color variant */
  variant?: LMBadgeVariant
  /** Size */
  size?: LMBadgeSize
  /** Custom class name */
  className?: string
  /** Show dot */
  dot?: boolean
  /** Icon */
  icon?: React.ReactNode
}

const sizeConfig = {
  xs: {
    padding: 'px-2 py-0.5',
    fontSize: 'text-xs',
    dotSize: 'w-1.5 h-1.5',
    iconSize: 'text-xs',
  },
  sm: {
    padding: 'px-3 py-1',
    fontSize: 'text-xs',
    dotSize: 'w-2 h-2',
    iconSize: 'text-xs',
  },
  md: {
    padding: 'px-3.5 py-1.5',
    fontSize: 'text-sm',
    dotSize: 'w-2 h-2',
    iconSize: 'text-sm',
  },
  lg: {
    padding: 'px-4 py-2',
    fontSize: 'text-sm',
    dotSize: 'w-2.5 h-2.5',
    iconSize: 'text-sm',
  },
  xl: {
    padding: 'px-5 py-2.5',
    fontSize: 'text-base',
    dotSize: 'w-3 h-3',
    iconSize: 'text-base',
  },
  '2xl': {
    padding: 'px-6 py-3',
    fontSize: 'text-lg',
    dotSize: 'w-3.5 h-3.5',
    iconSize: 'text-lg',
  },
}

const LMBadge: React.FC<LMBadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
  dot = false,
  icon,
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    const variantMap: Record<LMBadgeVariant, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--lm-primary-100)',
        color: 'var(--lm-primary-700)',
        borderColor: 'var(--lm-primary-200)',
      },
      secondary: {
        backgroundColor: 'var(--lm-gray-100)',
        color: 'var(--lm-gray-700)',
        borderColor: 'var(--lm-gray-200)',
      },
      success: {
        backgroundColor: 'var(--lm-success-100)',
        color: 'var(--lm-success-700)',
        borderColor: 'var(--lm-success-200)',
      },
      warning: {
        backgroundColor: 'var(--lm-warning-100)',
        color: 'var(--lm-warning-700)',
        borderColor: 'var(--lm-warning-200)',
      },
      error: {
        backgroundColor: 'var(--lm-error-100)',
        color: 'var(--lm-error-700)',
        borderColor: 'var(--lm-error-200)',
      },
      info: {
        backgroundColor: 'var(--lm-info-100)',
        color: 'var(--lm-info-700)',
        borderColor: 'var(--lm-info-200)',
      },
      neutral: {
        backgroundColor: 'var(--lm-bg-elevated)',
        color: 'var(--lm-text-secondary)',
        borderColor: 'var(--lm-border-default)',
      },
    }

    return variantMap[variant]
  }

  const getDotColor = (): string => {
    const dotColorMap: Record<LMBadgeVariant, string> = {
      primary: 'var(--lm-primary-500)',
      secondary: 'var(--lm-gray-500)',
      success: 'var(--lm-success-500)',
      warning: 'var(--lm-warning-500)',
      error: 'var(--lm-error-500)',
      info: 'var(--lm-info-500)',
      neutral: 'var(--lm-text-disabled)',
    }

    return dotColorMap[variant]
  }

  const currentSize = sizeConfig[size]

  // Apple-like refined badge styling
  return (
    <span
      className={`inline-flex items-center justify-center ${currentSize.padding} ${currentSize.fontSize} rounded-full border font-medium select-none ${className}`}
      style={{
        ...getVariantStyles(),
        transition: 'all var(--lm-transition-fast) var(--lm-ease-out)',
      }}
    >
      {dot && (
        <span
          className={`${currentSize.dotSize} rounded-full mr-1.5 shrink-0`}
          style={{ backgroundColor: getDotColor() }}
        />
      )}
      {icon && (
        <span className={`${currentSize.iconSize} mr-1.5 shrink-0`}>
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </span>
  )
}

export default LMBadge
