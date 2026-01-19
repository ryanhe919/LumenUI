import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_TEXT_CLASSES,
  SIZE_GAP_CLASSES,
  clampComponentSize,
} from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'

export interface LMTabItem {
  /** Unique key */
  key: string
  /** Tab label */
  label: React.ReactNode
  /** Tab content */
  children?: React.ReactNode
  /** Disabled state */
  disabled?: boolean
  /** Icon before label */
  icon?: React.ReactNode
}

export interface LMTabsProps {
  /** Controlled active key */
  activeKey?: string
  /** Default active key */
  defaultActiveKey?: string
  /** Tab items */
  items: LMTabItem[]
  /** Tab style type */
  type?: 'line' | 'card' | 'rounded'
  /** Component size */
  size?: ComponentSize
  /** Center tabs */
  centered?: boolean
  /** Extra content on the right */
  tabBarExtraContent?: React.ReactNode
  /** Active key change handler */
  onChange?: (activeKey: string) => void
  /** Tab click handler */
  onTabClick?: (key: string) => void
  /** Custom class name */
  className?: string
}

const LMTabs: React.FC<LMTabsProps> = ({
  activeKey: controlledActiveKey,
  defaultActiveKey,
  items,
  type = 'line',
  size = 'md',
  centered = false,
  tabBarExtraContent,
  onChange,
  onTabClick,
  className = '',
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const [internalActiveKey, setInternalActiveKey] = useState(
    defaultActiveKey || items[0]?.key || ''
  )
  const [inkStyle, setInkStyle] = useState<React.CSSProperties>({})
  const tabsRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const activeKey = controlledActiveKey ?? internalActiveKey

  const tabPaddingClasses: Record<ComponentSize, string> = {
    xs: 'px-2 py-1',
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5',
    xl: 'px-6 py-3',
    '2xl': 'px-8 py-4',
  }

  const cardPaddingClasses: Record<ComponentSize, string> = {
    xs: 'px-2 py-1',
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5',
    xl: 'px-6 py-3',
    '2xl': 'px-8 py-4',
  }

  const updateInkBar = useCallback(() => {
    if (type !== 'line') return

    const activeTab = tabRefs.current.get(activeKey)
    const container = tabsRef.current

    if (activeTab && container) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()

      setInkStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      })
    }
  }, [activeKey, type])

  useEffect(() => {
    updateInkBar()
  }, [updateInkBar])

  useEffect(() => {
    const handleResize = () => updateInkBar()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateInkBar])

  const handleTabClick = (item: LMTabItem) => {
    if (item.disabled) return

    onTabClick?.(item.key)

    if (controlledActiveKey === undefined) {
      setInternalActiveKey(item.key)
    }
    onChange?.(item.key)
  }

  const getTabStyles = (item: LMTabItem, isActive: boolean): React.CSSProperties => {
    if (item.disabled) {
      return {
        color: 'var(--lm-text-disabled)',
        cursor: 'not-allowed',
      }
    }

    if (type === 'line') {
      return {
        color: isActive ? 'var(--lm-primary-600)' : 'var(--lm-text-secondary)',
        backgroundColor: 'transparent',
      }
    }

    if (type === 'card') {
      return {
        color: isActive ? 'var(--lm-primary-600)' : 'var(--lm-text-secondary)',
        backgroundColor: isActive ? 'var(--lm-bg-elevated)' : 'transparent',
        borderColor: isActive ? 'var(--lm-border-default)' : 'transparent',
        borderBottomColor: isActive ? 'var(--lm-bg-elevated)' : 'transparent',
      }
    }

    // rounded
    return {
      color: isActive ? 'white' : 'var(--lm-text-secondary)',
      backgroundColor: isActive ? 'var(--lm-primary-500)' : 'transparent',
    }
  }

  const getTabHoverStyles = (item: LMTabItem, isActive: boolean): React.CSSProperties => {
    if (item.disabled || isActive) return {}

    if (type === 'line') {
      return {
        color: 'var(--lm-text-primary)',
      }
    }

    if (type === 'card') {
      return {
        color: 'var(--lm-text-primary)',
        backgroundColor: 'var(--lm-bg-hover)',
      }
    }

    // rounded
    return {
      color: 'var(--lm-text-primary)',
      backgroundColor: 'var(--lm-bg-hover)',
    }
  }

  const renderTab = (item: LMTabItem) => {
    const isActive = item.key === activeKey

    const baseClasses = `
      ${type === 'line' ? tabPaddingClasses[resolvedSize] : cardPaddingClasses[resolvedSize]}
      ${SIZE_TEXT_CLASSES[resolvedSize]}
      flex items-center ${SIZE_GAP_CLASSES[resolvedSize]}
      font-medium transition-all duration-200
      outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--lm-primary-400)]
    `

    const typeClasses = {
      line: '',
      card: `border border-b-0 rounded-t-lg ${isActive ? '-mb-px' : ''}`,
      rounded: 'rounded-full',
    }

    return (
      <button
        key={item.key}
        ref={(el) => {
          if (el) tabRefs.current.set(item.key, el)
        }}
        className={`${baseClasses} ${typeClasses[type]}`}
        style={getTabStyles(item, isActive)}
        onClick={() => handleTabClick(item)}
        disabled={item.disabled}
        role="tab"
        aria-selected={isActive}
        aria-disabled={item.disabled}
        tabIndex={isActive ? 0 : -1}
        onMouseEnter={(e) => {
          if (!item.disabled && !isActive) {
            Object.assign(e.currentTarget.style, getTabHoverStyles(item, isActive))
          }
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, getTabStyles(item, isActive))
        }}
      >
        {item.icon && <span className="shrink-0">{item.icon}</span>}
        <span>{item.label}</span>
      </button>
    )
  }

  const activeItem = items.find((item) => item.key === activeKey)

  return (
    <div className={className}>
      {/* Tab bar */}
      <div
        className={`
          flex items-center
          ${centered ? 'justify-center' : 'justify-between'}
          ${type === 'line' ? 'border-b' : ''}
          ${type === 'card' ? 'border-b' : ''}
        `}
        style={{
          borderColor: type === 'line' || type === 'card' ? 'var(--lm-border-default)' : undefined,
        }}
      >
        {/* Tabs */}
        <div
          ref={tabsRef}
          className={`
            flex items-center relative
            ${type === 'rounded' ? `${SIZE_GAP_CLASSES[resolvedSize]} p-1 rounded-full` : ''}
          `}
          style={{
            backgroundColor: type === 'rounded' ? 'var(--lm-bg-paper)' : undefined,
          }}
          role="tablist"
        >
          {items.map(renderTab)}

          {/* Ink bar for line type */}
          {type === 'line' && (
            <div
              className="absolute bottom-0 h-0.5 transition-all duration-300"
              style={{
                ...inkStyle,
                backgroundColor: 'var(--lm-primary-500)',
              }}
            />
          )}
        </div>

        {/* Extra content */}
        {tabBarExtraContent && !centered && (
          <div className="shrink-0 ml-4">{tabBarExtraContent}</div>
        )}
      </div>

      {/* Tab content */}
      {activeItem?.children && (
        <div className="pt-4" role="tabpanel">
          {activeItem.children}
        </div>
      )}
    </div>
  )
}

export default LMTabs
