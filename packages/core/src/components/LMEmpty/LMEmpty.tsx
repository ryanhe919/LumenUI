import React from 'react'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_GAP_CLASSES,
  clampComponentSize,
} from '../../utils/componentSizes'
import type { ComponentSize } from '../../utils/componentSizes'

export interface LMEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom image or preset type */
  image?: React.ReactNode | 'default' | 'simple'
  /** Custom image style */
  imageStyle?: React.CSSProperties
  /** Description text */
  description?: React.ReactNode
  /** Actions or extra content below description */
  children?: React.ReactNode
  /** Component size */
  size?: ComponentSize
}

/** Default empty illustration */
const DefaultImage: React.FC<{ size: ComponentSize }> = ({ size }) => {
  const sizeMap: Record<ComponentSize, number> = {
    xs: 64,
    sm: 80,
    md: 100,
    lg: 120,
    xl: 140,
    '2xl': 160,
  }
  const dimension = sizeMap[size]

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Box base */}
      <path
        d="M20 40L50 25L80 40V70L50 85L20 70V40Z"
        fill="var(--lm-bg-paper)"
        stroke="var(--lm-border-default)"
        strokeWidth="2"
      />
      {/* Box lid */}
      <path
        d="M20 40L50 55L80 40"
        stroke="var(--lm-border-default)"
        strokeWidth="2"
      />
      {/* Center line */}
      <path
        d="M50 55V85"
        stroke="var(--lm-border-default)"
        strokeWidth="2"
      />
      {/* Decorative circles */}
      <circle cx="35" cy="20" r="3" fill="var(--lm-border-light)" />
      <circle cx="65" cy="18" r="2" fill="var(--lm-border-light)" />
      <circle cx="75" cy="28" r="2.5" fill="var(--lm-border-light)" />
    </svg>
  )
}

/** Simple empty illustration */
const SimpleImage: React.FC<{ size: ComponentSize }> = ({ size }) => {
  const sizeMap: Record<ComponentSize, number> = {
    xs: 48,
    sm: 56,
    md: 64,
    lg: 72,
    xl: 80,
    '2xl': 88,
  }
  const dimension = sizeMap[size]

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simple file icon */}
      <rect
        x="16"
        y="8"
        width="32"
        height="48"
        rx="4"
        fill="var(--lm-bg-paper)"
        stroke="var(--lm-border-default)"
        strokeWidth="2"
      />
      {/* Lines */}
      <line
        x1="24"
        y1="24"
        x2="40"
        y2="24"
        stroke="var(--lm-border-light)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="32"
        x2="40"
        y2="32"
        stroke="var(--lm-border-light)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="24"
        y1="40"
        x2="32"
        y2="40"
        stroke="var(--lm-border-light)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

const LMEmpty: React.FC<LMEmptyProps> = ({
  image = 'default',
  imageStyle,
  description = '暂无数据',
  children,
  size = 'md',
  className = '',
  ...rest
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)

  const descriptionTextClasses: Record<ComponentSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-base',
    '2xl': 'text-lg',
  }

  const paddingClasses: Record<ComponentSize, string> = {
    xs: 'py-4',
    sm: 'py-6',
    md: 'py-8',
    lg: 'py-10',
    xl: 'py-12',
    '2xl': 'py-16',
  }

  const baseClassName = `
    flex flex-col items-center justify-center
    ${paddingClasses[resolvedSize]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ')

  const renderImage = () => {
    if (image === 'default') {
      return <DefaultImage size={resolvedSize} />
    }
    if (image === 'simple') {
      return <SimpleImage size={resolvedSize} />
    }
    return image
  }

  return (
    <div className={baseClassName} {...rest}>
      {/* Image */}
      {image && (
        <div
          className={`mb-4 ${SIZE_GAP_CLASSES[resolvedSize]}`}
          style={imageStyle}
        >
          {renderImage()}
        </div>
      )}

      {/* Description */}
      {description && (
        <p
          className={`${descriptionTextClasses[resolvedSize]} text-center`}
          style={{ color: 'var(--lm-text-secondary)' }}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {children && (
        <div className={`mt-4 ${SIZE_GAP_CLASSES[resolvedSize]}`}>
          {children}
        </div>
      )}
    </div>
  )
}

export default LMEmpty
