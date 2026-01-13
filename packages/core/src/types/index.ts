import type { ComponentSize } from '../utils/componentSizes'

export type { ComponentSize }

/**
 * Common component props
 */
export interface BaseComponentProps {
  className?: string
  style?: React.CSSProperties
}

/**
 * Component variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'

export type InputVariant = 'default' | 'filled' | 'outline'

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'

/**
 * Form field status
 */
export type FieldStatus = 'default' | 'success' | 'warning' | 'error'

/**
 * Common event handlers
 */
export type ChangeHandler<T = string> = (value: T) => void
