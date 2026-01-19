import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_PADDING_CLASSES,
  clampComponentSize,
} from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'

export interface LMDrawerProps {
  /** Visibility state */
  visible: boolean
  /** Drawer title */
  title?: React.ReactNode
  /** Drawer content */
  children: React.ReactNode
  /** Drawer placement */
  placement?: 'top' | 'right' | 'bottom' | 'left'
  /** Drawer width (for left/right placement) */
  width?: string | number
  /** Drawer height (for top/bottom placement) */
  height?: string | number
  /** Show close button */
  closable?: boolean
  /** Show mask */
  mask?: boolean
  /** Close on mask click */
  maskClosable?: boolean
  /** Footer content */
  footer?: React.ReactNode
  /** Close handler */
  onClose?: () => void
  /** Component size */
  size?: ComponentSize
  /** Extra content in header */
  extra?: React.ReactNode
  /** Custom class name */
  className?: string
  /** Z-index */
  zIndex?: number
}

const CloseIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const LMDrawer: React.FC<LMDrawerProps> = ({
  visible,
  title,
  children,
  placement = 'right',
  width = 378,
  height = 378,
  closable = true,
  mask = true,
  maskClosable = true,
  footer,
  onClose,
  size = 'md',
  extra,
  className = '',
  zIndex = 1000,
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)

  const titleTextClasses: Record<ComponentSize, string> = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
  }

  // Handle ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        onClose?.()
      }
    },
    [visible, onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Lock body scroll when visible
  useEffect(() => {
    if (visible) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [visible])

  const handleMaskClick = () => {
    if (maskClosable) {
      onClose?.()
    }
  }

  const getDrawerStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      backgroundColor: 'var(--lm-bg-elevated)',
      boxShadow: 'var(--lm-shadow-xl)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: zIndex + 1,
      transition: 'transform 0.3s ease-in-out',
    }

    const widthValue = typeof width === 'number' ? `${width}px` : width
    const heightValue = typeof height === 'number' ? `${height}px` : height

    switch (placement) {
      case 'right':
        return {
          ...base,
          top: 0,
          right: 0,
          bottom: 0,
          width: widthValue,
          maxWidth: '100vw',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
        }
      case 'left':
        return {
          ...base,
          top: 0,
          left: 0,
          bottom: 0,
          width: widthValue,
          maxWidth: '100vw',
          transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        }
      case 'top':
        return {
          ...base,
          top: 0,
          left: 0,
          right: 0,
          height: heightValue,
          maxHeight: '100vh',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        }
      case 'bottom':
        return {
          ...base,
          bottom: 0,
          left: 0,
          right: 0,
          height: heightValue,
          maxHeight: '100vh',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
        }
      default:
        return base
    }
  }

  if (typeof document === 'undefined') return null

  const drawerContent = (
    <div
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Mask */}
      {mask && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            zIndex,
          }}
          onClick={handleMaskClick}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        style={getDrawerStyles()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {/* Header */}
        {(title || closable || extra) && (
          <div
            className={`flex items-center justify-between ${SIZE_PADDING_CLASSES[resolvedSize]} border-b`}
            style={{ borderColor: 'var(--lm-border-default)' }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {title && (
                <h3
                  id="drawer-title"
                  className={`${titleTextClasses[resolvedSize]} font-semibold truncate`}
                  style={{ color: 'var(--lm-text-primary)' }}
                >
                  {title}
                </h3>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {extra}
              {closable && (
                <button
                  className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-(--lm-bg-hover)"
                  style={{ color: 'var(--lm-text-secondary)' }}
                  onClick={onClose}
                  aria-label="关闭"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div
          className={`flex-1 overflow-auto ${SIZE_PADDING_CLASSES[resolvedSize]}`}
          style={{ color: 'var(--lm-text-primary)' }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={`flex items-center justify-end gap-2 ${SIZE_PADDING_CLASSES[resolvedSize]} border-t`}
            style={{ borderColor: 'var(--lm-border-default)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(drawerContent, document.body)
}

export default LMDrawer
