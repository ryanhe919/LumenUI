import React, { useState, useRef, useEffect } from 'react'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_TOOLTIP_CONFIG,
  clampComponentSize,
} from '../../utils/componentSizes'
import type { ComponentSize } from '../../utils/componentSizes'

export interface LMTooltipProps {
  /** Tooltip content */
  content: React.ReactNode
  /** Trigger element */
  children: React.ReactNode
  /** Placement */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Max width */
  maxWidth?: number
  /** Size */
  size?: ComponentSize
}

const LMTooltip: React.FC<LMTooltipProps> = ({
  content,
  children,
  placement = 'top',
  maxWidth,
  size = 'sm',
}) => {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const effectiveMaxWidth =
    maxWidth ?? SIZE_TOOLTIP_CONFIG[resolvedSize].maxWidth

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8
          left =
            triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'bottom':
          top = triggerRect.bottom + 8
          left =
            triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'left':
          top =
            triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.left - tooltipRect.width - 8
          break
        case 'right':
          top =
            triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.right + 8
          break
      }

      // Ensure tooltip doesn't overflow viewport
      const padding = 8
      if (left < padding) left = padding
      if (left + tooltipRect.width > window.innerWidth - padding) {
        left = window.innerWidth - tooltipRect.width - padding
      }
      if (top < padding) top = padding
      if (top + tooltipRect.height > window.innerHeight - padding) {
        top = window.innerHeight - tooltipRect.height - padding
      }

      setPosition({ top, left })
    }
  }, [visible, placement])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {visible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 ${SIZE_TOOLTIP_CONFIG[resolvedSize].paddingClass} ${SIZE_TOOLTIP_CONFIG[resolvedSize].textClass} rounded-lg shadow-lg pointer-events-none`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            maxWidth: `${effectiveMaxWidth}px`,
            backgroundColor: 'var(--lm-bg-elevated)',
            borderColor: 'var(--lm-border-default)',
            color: 'var(--lm-text-primary)',
            border: '1px solid',
          }}
        >
          {content}
        </div>
      )}
    </>
  )
}

export default LMTooltip
