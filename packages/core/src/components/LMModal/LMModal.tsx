import React, { useEffect, useRef, useCallback, memo } from 'react'
import { createPortal } from 'react-dom'
import { LMButton } from '../LMButton'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_HEADING_CLASSES,
  SIZE_MODAL_CONFIG,
  clampComponentSize,
} from '../../utils/componentSizes'
import type { ComponentSize } from '../../utils/componentSizes'

const MODAL_FOOTER_SIZE_MAP: Record<ComponentSize, ComponentSize> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'md',
  '2xl': 'lg',
}

export interface LMModalProps {
  /** Visibility */
  visible: boolean
  /** Title */
  title?: string
  /** Content */
  children: React.ReactNode
  /** Custom footer */
  footer?: React.ReactNode
  /** Close callback */
  onClose?: () => void
  /** OK callback */
  onOk?: () => void
  /** Cancel callback */
  onCancel?: () => void
  /** OK button text */
  okText?: string
  /** Cancel button text */
  cancelText?: string
  /** Show OK button */
  showOk?: boolean
  /** Show Cancel button */
  showCancel?: boolean
  /** OK loading state */
  okLoading?: boolean
  /** Cancel loading state */
  cancelLoading?: boolean
  /** Show mask */
  mask?: boolean
  /** Click mask to close */
  maskClosable?: boolean
  /** Show close button */
  closable?: boolean
  /** Custom close icon */
  closeIcon?: React.ReactNode
  /** Header icon */
  headerIcon?: React.ReactNode
  /** Width */
  width?: string | number
  /** Height */
  height?: string | number
  /** Size preset */
  size?: ComponentSize
  /** Custom class name */
  className?: string
  /** Custom style */
  style?: React.CSSProperties
  /** Center vertically */
  centered?: boolean
  /** Fullscreen mode */
  fullscreen?: boolean
  /** Animation duration (ms) */
  animationDuration?: number
  /** Enable animation */
  animation?: boolean
}

const LMModal: React.FC<LMModalProps> = ({
  visible,
  title,
  children,
  footer,
  onClose,
  onOk,
  onCancel,
  okText = 'Confirm',
  cancelText = 'Cancel',
  showOk = true,
  showCancel = true,
  okLoading = false,
  cancelLoading = false,
  mask = true,
  maskClosable = false,
  closable = true,
  closeIcon,
  headerIcon,
  width,
  height,
  size = 'md',
  className = '',
  style,
  centered = true,
  fullscreen = false,
  animationDuration = 300,
  animation = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const footerButtonSize = MODAL_FOOTER_SIZE_MAP[resolvedSize]

  const getModalStyles = () => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: 'var(--lm-bg-elevated)',
      color: 'var(--lm-text-primary)',
      borderColor: 'var(--lm-border-default)',
      boxShadow: 'var(--lm-shadow-xl)',
      borderRadius: '1rem',
      border: '1px solid var(--lm-border-default)',
      backdropFilter: 'blur(10px)',
      ...style,
    }

    if (fullscreen) {
      baseStyles.width = '100vw'
      baseStyles.height = '100vh'
      baseStyles.maxWidth = '100vw'
      baseStyles.maxHeight = '100vh'
      baseStyles.borderRadius = '0'
    } else {
      baseStyles.width = width
        ? typeof width === 'number'
          ? `${width}px`
          : width
        : SIZE_MODAL_CONFIG[resolvedSize].width
      baseStyles.maxWidth = SIZE_MODAL_CONFIG[resolvedSize].maxWidth
      if (height) {
        baseStyles.height = typeof height === 'number' ? `${height}px` : height
      }
    }

    return baseStyles
  }

  const getBackdropStyles = () =>
    mask
      ? { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }
      : { backgroundColor: 'transparent', backdropFilter: 'none' }

  const handleOk = () => (onOk ? onOk() : onClose?.())

  const handleCancel = useCallback(() => {
    if (onCancel) onCancel()
    else onClose?.()
  }, [onCancel, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (maskClosable && e.target === backdropRef.current) handleCancel()
  }

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (visible && e.key === 'Escape') handleCancel()
    }
    if (visible) {
      document.addEventListener('keydown', keyHandler)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', keyHandler)
      if (visible) document.body.style.overflow = ''
    }
  }, [visible, handleCancel])

  const CloseIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  const WindowIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )

  const defaultFooter = (
    <div
      className="flex items-center justify-end gap-3 px-6 py-4 border-t"
      style={{ borderColor: 'var(--lm-border-default)' }}
    >
      {showCancel && (
        <LMButton
          variant="secondary"
          size={footerButtonSize}
          onClick={handleCancel}
          disabled={cancelLoading}
          loading={cancelLoading}
        >
          {cancelText}
        </LMButton>
      )}
      {showOk && (
        <LMButton
          variant="primary"
          size={footerButtonSize}
          onClick={handleOk}
          disabled={okLoading}
          loading={okLoading}
        >
          {okText}
        </LMButton>
      )}
    </div>
  )

  const getAnimationClasses = () => {
    if (!animation) return ''
    const ms = animationDuration
    const durationClass =
      ms <= 150
        ? 'duration-150'
        : ms <= 200
          ? 'duration-200'
          : ms <= 300
            ? 'duration-300'
            : ms <= 500
              ? 'duration-500'
              : ms <= 700
                ? 'duration-700'
                : 'duration-1000'
    return `transition-all ${durationClass} ease-in-out`
  }

  if (!visible) return null

  const modalContent = (
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 flex ${centered ? 'items-center' : 'items-start pt-20'} justify-center ${getAnimationClasses()}`}
      style={getBackdropStyles()}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`relative ${getAnimationClasses()} ${className}`}
        style={getModalStyles()}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || closable) && (
          <div
            className="flex items-center justify-between p-6 pb-4 border-b"
            style={{ borderColor: 'var(--lm-border-default)' }}
          >
            {title && (
              <h3
                className={`font-bold flex items-center gap-2 ${SIZE_HEADING_CLASSES[resolvedSize]}`}
                style={{ color: 'var(--lm-text-primary)' }}
              >
                <span style={{ color: 'var(--lm-text-secondary)' }}>
                  {headerIcon || <WindowIcon />}
                </span>
                {title}
              </h3>
            )}
            {closable && (
              <LMButton
                variant="ghost"
                size="xs"
                onClick={handleCancel}
                leftIcon={closeIcon || <CloseIcon />}
                className="w-8 h-8 p-0"
                aria-label="Close dialog"
                title="Close"
                style={{
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--lm-bg-paper)',
                  borderColor: 'var(--lm-border-default)',
                  color: 'var(--lm-text-secondary)',
                }}
              />
            )}
          </div>
        )}

        <div className="p-6">{children}</div>

        {footer !== undefined
          ? footer
          : showOk || showCancel
            ? defaultFooter
            : null}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default memo(LMModal)
