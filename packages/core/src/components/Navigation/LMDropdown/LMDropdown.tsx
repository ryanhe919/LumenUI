import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_TEXT_CLASSES,
  SIZE_GAP_CLASSES,
  clampComponentSize,
} from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'

export interface LMDropdownMenuItem {
  /** Unique key */
  key: string
  /** Menu item label */
  label: React.ReactNode
  /** Icon before label */
  icon?: React.ReactNode
  /** Disabled state */
  disabled?: boolean
  /** Danger style (red) */
  danger?: boolean
  /** Show as divider */
  divider?: boolean
}

export interface LMDropdownProps {
  /** Trigger type */
  trigger?: 'click' | 'hover' | 'contextMenu'
  /** Menu items */
  menu: LMDropdownMenuItem[]
  /** Dropdown placement */
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
  /** Disabled state */
  disabled?: boolean
  /** Component size */
  size?: ComponentSize
  /** Trigger element */
  children: React.ReactNode
  /** Selection callback */
  onSelect?: (key: string) => void
  /** Visibility change callback */
  onVisibleChange?: (visible: boolean) => void
  /** Custom class name */
  className?: string
}

const LMDropdown: React.FC<LMDropdownProps> = ({
  trigger = 'click',
  menu,
  placement = 'bottomLeft',
  disabled = false,
  size = 'md',
  children,
  onSelect,
  onVisibleChange,
  className = '',
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<number | null>(null)

  const itemPaddingClasses: Record<ComponentSize, string> = {
    xs: 'px-2 py-1',
    sm: 'px-2.5 py-1.5',
    md: 'px-3 py-2',
    lg: 'px-4 py-2.5',
    xl: 'px-5 py-3',
    '2xl': 'px-6 py-4',
  }

  const minWidthClasses: Record<ComponentSize, string> = {
    xs: 'min-w-[100px]',
    sm: 'min-w-[120px]',
    md: 'min-w-[140px]',
    lg: 'min-w-[160px]',
    xl: 'min-w-[180px]',
    '2xl': 'min-w-[200px]',
  }

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !dropdownRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const dropdownRect = dropdownRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    let top = 0
    let left = 0

    switch (placement) {
      case 'bottomLeft':
        top = triggerRect.bottom + scrollY + 4
        left = triggerRect.left + scrollX
        break
      case 'bottomRight':
        top = triggerRect.bottom + scrollY + 4
        left = triggerRect.right + scrollX - dropdownRect.width
        break
      case 'topLeft':
        top = triggerRect.top + scrollY - dropdownRect.height - 4
        left = triggerRect.left + scrollX
        break
      case 'topRight':
        top = triggerRect.top + scrollY - dropdownRect.height - 4
        left = triggerRect.right + scrollX - dropdownRect.width
        break
    }

    // Boundary check
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left + dropdownRect.width > viewportWidth + scrollX) {
      left = viewportWidth + scrollX - dropdownRect.width - 8
    }
    if (left < scrollX) {
      left = scrollX + 8
    }
    if (top + dropdownRect.height > viewportHeight + scrollY) {
      top = triggerRect.top + scrollY - dropdownRect.height - 4
    }
    if (top < scrollY) {
      top = triggerRect.bottom + scrollY + 4
    }

    setPosition({ top, left })
  }, [placement])

  const show = useCallback(() => {
    if (disabled) return
    setVisible(true)
    onVisibleChange?.(true)
  }, [disabled, onVisibleChange])

  const hide = useCallback(() => {
    setVisible(false)
    onVisibleChange?.(false)
  }, [onVisibleChange])

  const toggle = useCallback(() => {
    if (visible) {
      hide()
    } else {
      show()
    }
  }, [visible, show, hide])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        hide()
      }
    }

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [visible, hide])

  // Update position when visible
  useEffect(() => {
    if (visible) {
      updatePosition()
    }
  }, [visible, updatePosition])

  // Handle scroll and resize
  useEffect(() => {
    if (visible) {
      const handleScrollResize = () => updatePosition()
      window.addEventListener('scroll', handleScrollResize, true)
      window.addEventListener('resize', handleScrollResize)
      return () => {
        window.removeEventListener('scroll', handleScrollResize, true)
        window.removeEventListener('resize', handleScrollResize)
      }
    }
  }, [visible, updatePosition])

  const handleTriggerClick = () => {
    if (trigger === 'click') {
      toggle()
    }
  }

  const handleTriggerMouseEnter = () => {
    if (trigger === 'hover') {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      show()
    }
  }

  const handleTriggerMouseLeave = () => {
    if (trigger === 'hover') {
      hoverTimeoutRef.current = window.setTimeout(() => {
        hide()
      }, 100)
    }
  }

  const handleDropdownMouseEnter = () => {
    if (trigger === 'hover' && hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

  const handleDropdownMouseLeave = () => {
    if (trigger === 'hover') {
      hoverTimeoutRef.current = window.setTimeout(() => {
        hide()
      }, 100)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    if (trigger === 'contextMenu') {
      e.preventDefault()
      toggle()
    }
  }

  const handleItemClick = (item: LMDropdownMenuItem) => {
    if (item.disabled || item.divider) return
    onSelect?.(item.key)
    hide()
  }

  const getItemStyles = (item: LMDropdownMenuItem, isHovered: boolean): React.CSSProperties => {
    if (item.disabled) {
      return {
        color: 'var(--lm-text-disabled)',
        cursor: 'not-allowed',
      }
    }
    if (item.danger) {
      return {
        color: isHovered ? 'white' : 'var(--lm-error-600)',
        backgroundColor: isHovered ? 'var(--lm-error-500)' : 'transparent',
      }
    }
    return {
      color: 'var(--lm-text-primary)',
      backgroundColor: isHovered ? 'var(--lm-bg-hover)' : 'transparent',
    }
  }

  // Apple-like refined dropdown styling
  const dropdownContent = visible && (
    <div
      ref={dropdownRef}
      className={`
        ${minWidthClasses[resolvedSize]}
        rounded-xl border py-1
      `}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 1000,
        backgroundColor: 'var(--lm-bg-elevated)',
        borderColor: 'var(--lm-border-default)',
        boxShadow: 'var(--lm-shadow-lg)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
      onMouseEnter={handleDropdownMouseEnter}
      onMouseLeave={handleDropdownMouseLeave}
    >
      {menu.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={item.key || `divider-${index}`}
              className="my-1 mx-2 border-t"
              style={{ borderColor: 'var(--lm-border-light)' }}
            />
          )
        }

        return (
          <MenuItem
            key={item.key}
            item={item}
            size={resolvedSize}
            paddingClass={itemPaddingClasses[resolvedSize]}
            textClass={SIZE_TEXT_CLASSES[resolvedSize]}
            gapClass={SIZE_GAP_CLASSES[resolvedSize]}
            getStyles={getItemStyles}
            onClick={handleItemClick}
          />
        )
      })}
    </div>
  )

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onClick={handleTriggerClick}
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
        onContextMenu={handleContextMenu}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </>
  )
}

// Separate MenuItem component for hover state
interface MenuItemProps {
  item: LMDropdownMenuItem
  size: ComponentSize
  paddingClass: string
  textClass: string
  gapClass: string
  getStyles: (item: LMDropdownMenuItem, isHovered: boolean) => React.CSSProperties
  onClick: (item: LMDropdownMenuItem) => void
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  paddingClass,
  textClass,
  gapClass,
  getStyles,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Apple-like refined menu item styling
  return (
    <div
      className={`
        ${paddingClass} ${textClass}
        flex items-center ${gapClass}
        cursor-pointer select-none
      `}
      style={{
        ...getStyles(item, isHovered),
        transition: 'all var(--lm-transition-fast) var(--lm-ease-out)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(item)}
      role="menuitem"
      aria-disabled={item.disabled}
    >
      {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
      <span className="flex-1">{item.label}</span>
    </div>
  )
}

export default LMDropdown
