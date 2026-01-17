import React, { useState, useEffect, useRef } from 'react'

export interface LMConfirmProps {
  /** Dialog visible */
  visible: boolean
  /** Dialog title */
  title?: string
  /** Dialog content */
  content: string
  /** Confirm button text */
  confirmText?: string
  /** Cancel button text */
  cancelText?: string
  /** Confirm button style */
  confirmButtonStyle?: 'primary' | 'danger'
  /** Confirm callback */
  onConfirm: () => void
  /** Cancel callback */
  onCancel: () => void
  /** Close on overlay click */
  closeOnOverlayClick?: boolean
}

const QuestionIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LMConfirm: React.FC<LMConfirmProps> = ({
  visible,
  title = 'Confirm',
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonStyle = 'primary',
  onConfirm,
  onCancel,
  closeOnOverlayClick = true,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationFrameRef = useRef<number>()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    // Cleanup previous timers
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (visible) {
      setIsVisible(true)
      animationFrameRef.current = requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    } else {
      setIsAnimating(false)
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
      }, 200)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [visible])

  const getConfirmButtonStyles = () => {
    switch (confirmButtonStyle) {
      case 'primary':
        return {
          backgroundColor: 'var(--lm-primary-500)',
          color: 'var(--lm-text-inverse)',
        }
      case 'danger':
        return {
          backgroundColor: 'var(--lm-error-500)',
          color: 'var(--lm-text-inverse)',
        }
    }
  }

  const getConfirmButtonHoverStyles = () => {
    switch (confirmButtonStyle) {
      case 'primary':
        return {
          backgroundColor: 'var(--lm-primary-600)',
        }
      case 'danger':
        return {
          backgroundColor: 'var(--lm-error-600)',
        }
    }
  }

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onCancel()
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-200 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
        onClick={handleOverlayClick}
      />

      {/* Dialog */}
      <div
        className={`relative backdrop-blur-xl rounded-3xl shadow-2xl border p-8 max-w-md w-full mx-auto transition-all duration-200 ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          backgroundColor: 'var(--lm-bg-elevated)',
          borderColor: 'var(--lm-border-default)',
          boxShadow: 'var(--lm-shadow-xl)',
        }}
      >
        {/* Icon area */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              backgroundColor: 'var(--lm-gray-100)',
            }}
          >
            <span style={{ color: 'var(--lm-gray-600)' }}>
              <QuestionIcon />
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-semibold mb-2"
            style={{
              color: 'var(--lm-text-primary)',
            }}
          >
            {title}
          </h3>

          {/* Content */}
          <p
            className="text-sm leading-relaxed"
            style={{
              color: 'var(--lm-text-secondary)',
            }}
          >
            {content}
          </p>
        </div>

        {/* Button area */}
        <div className="flex space-x-3">
          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: 'var(--lm-gray-100)',
              color: 'var(--lm-text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--lm-gray-200)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--lm-gray-100)'
            }}
          >
            {cancelText}
          </button>

          {/* Confirm button */}
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={getConfirmButtonStyles()}
            onMouseEnter={(e) => {
              const hoverStyles = getConfirmButtonHoverStyles()
              e.currentTarget.style.backgroundColor = hoverStyles?.backgroundColor || ''
            }}
            onMouseLeave={(e) => {
              const normalStyles = getConfirmButtonStyles()
              e.currentTarget.style.backgroundColor = normalStyles?.backgroundColor || ''
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LMConfirm
