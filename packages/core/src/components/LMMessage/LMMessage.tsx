import React, { useEffect, useMemo } from 'react'

export type LMMessageType = 'success' | 'error' | 'warning' | 'info'

export interface LMMessageItem {
  id: string
  type: LMMessageType
  title?: string
  content: string
  duration?: number
}

export interface LMMessageProps {
  id: string
  type: LMMessageType
  title?: string
  content: string
  /** Auto close duration in ms, 0 means no auto close */
  duration?: number
  onClose: (id: string) => void
}

interface Tone {
  accent: string
  background: string
  text: string
  title: string
}

const ICONS: Record<LMMessageType, React.ReactNode> = {
  success: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M16.7 9.3a1 1 0 0 0-1.4-1.4L11 12.2 8.7 9.9a1 1 0 1 0-1.4 1.4l3 3a1 1 0 0 0 1.4 0l5-5Z"
        fill="currentColor"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M15.5 8.5l-7 7M8.5 8.5l7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12.9 4.5c-.4-.7-1.4-.7-1.8 0L3.5 18a1 1 0 0 0 .9 1.5h15.2a1 1 0 0 0 .9-1.5l-7.6-13.5Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path d="M12 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M12 10.5v5M12 7.5h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
}

const useTone = (type: LMMessageType): Tone => {
  switch (type) {
    case 'success':
      return {
        accent: 'var(--lm-success-500)',
        background: 'color-mix(in srgb, var(--lm-success-100) 60%, transparent)',
        text: 'var(--lm-success-700)',
        title: 'var(--lm-success-800)',
      }
    case 'error':
      return {
        accent: 'var(--lm-error-500)',
        background: 'color-mix(in srgb, var(--lm-error-100) 60%, transparent)',
        text: 'var(--lm-error-700)',
        title: 'var(--lm-error-800)',
      }
    case 'warning':
      return {
        accent: 'var(--lm-warning-500)',
        background: 'color-mix(in srgb, var(--lm-warning-100) 60%, transparent)',
        text: 'var(--lm-warning-700)',
        title: 'var(--lm-warning-800)',
      }
    case 'info':
    default:
      return {
        accent: 'var(--lm-primary-500)',
        background: 'color-mix(in srgb, var(--lm-primary-100) 60%, transparent)',
        text: 'var(--lm-primary-700)',
        title: 'var(--lm-primary-800)',
      }
  }
}

const LMMessage: React.FC<LMMessageProps> = ({ id, type, title, content, duration = 2000, onClose }) => {
  const tone = useTone(type)

  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(() => onClose(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const icon = useMemo(() => ICONS[type], [type])
  const ariaRole = 'status'
  const ariaLabel = useMemo(() => {
    switch (type) {
      case 'success':
        return 'Success message'
      case 'error':
        return 'Error message'
      case 'warning':
        return 'Warning message'
      default:
        return 'Information message'
    }
  }, [type])

  return (
    <div className="max-w-sm mx-auto will-change-transform" role={ariaRole} aria-label={ariaLabel}>
      <div
        className="rounded-3xl shadow-lg p-5 mb-3 backdrop-blur-md border transition-all duration-300 ease-out"
        style={{
          backgroundColor: tone.background,
          borderColor: 'var(--lm-border-light)',
          boxShadow: 'var(--lm-shadow-lg)',
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{
              color: tone.accent,
              backgroundColor: 'color-mix(in srgb, currentColor 12%, transparent)',
            }}
          >
            {icon}
          </div>

          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="text-sm font-semibold mb-2 truncate" style={{ color: tone.title }}>
                {title}
              </h4>
            )}
            <p className="text-sm leading-relaxed break-words" style={{ color: tone.text }}>
              {content}
            </p>
          </div>

          <button
            onClick={() => onClose(id)}
            aria-label="Close message"
            className="flex-shrink-0 p-2 rounded-xl transition-all duration-200 hover:bg-black/5 active:bg-black/10"
            style={{ color: tone.accent }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export interface LMMessageContainerProps {
  /** Messages list */
  messages: LMMessageItem[]
  /** Close callback */
  onClose: (id: string) => void
  /** Position */
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
}

export const LMMessageContainer: React.FC<LMMessageContainerProps> = ({
  messages,
  onClose,
  position = 'top-right',
}) => {
  if (messages.length === 0) return null

  const positionClasses = {
    'top-right': 'top-20 right-6',
    'top-left': 'top-20 left-6',
    'top-center': 'top-20 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  }

  return (
    <div className={`fixed z-50 space-y-3 ${positionClasses[position]}`}>
      {messages.map((message) => (
        <LMMessage key={message.id} {...message} onClose={onClose} />
      ))}
    </div>
  )
}

export default LMMessage
