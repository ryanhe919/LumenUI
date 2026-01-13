import React, { useState, useCallback } from 'react'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_TEXT_CLASSES,
  SIZE_GAP_CLASSES,
  clampComponentSize,
} from '../../utils/componentSizes'
import type { ComponentSize } from '../../utils/componentSizes'

export interface LMMenuItem {
  /** Unique key */
  key: string
  /** Menu item label */
  label: React.ReactNode
  /** Icon before label */
  icon?: React.ReactNode
  /** Disabled state */
  disabled?: boolean
  /** Sub menu items */
  children?: LMMenuItem[]
  /** Item type: group or divider */
  type?: 'group' | 'divider'
}

export interface LMMenuProps {
  /** Menu items */
  items: LMMenuItem[]
  /** Menu mode */
  mode?: 'vertical' | 'horizontal' | 'inline'
  /** Menu theme */
  theme?: 'light' | 'dark'
  /** Selected keys (controlled) */
  selectedKeys?: string[]
  /** Default selected keys */
  defaultSelectedKeys?: string[]
  /** Open keys (controlled) */
  openKeys?: string[]
  /** Default open keys */
  defaultOpenKeys?: string[]
  /** Collapsed state (for inline mode) */
  collapsed?: boolean
  /** Collapsed width */
  collapsedWidth?: number
  /** Selection handler */
  onSelect?: (key: string, keyPath: string[]) => void
  /** Open change handler */
  onOpenChange?: (openKeys: string[]) => void
  /** Component size */
  size?: ComponentSize
  /** Custom class name */
  className?: string
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)


const LMMenu: React.FC<LMMenuProps> = ({
  items,
  mode = 'inline',
  theme = 'light',
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys = [],
  openKeys: controlledOpenKeys,
  defaultOpenKeys = [],
  collapsed = false,
  collapsedWidth = 64,
  onSelect,
  onOpenChange,
  size = 'md',
  className = '',
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(defaultSelectedKeys)
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(defaultOpenKeys)

  const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys
  const openKeys = controlledOpenKeys ?? internalOpenKeys

  const itemPaddingClasses: Record<ComponentSize, string> = {
    xs: 'px-3 py-1.5',
    sm: 'px-3 py-2',
    md: 'px-4 py-2.5',
    lg: 'px-5 py-3',
    xl: 'px-6 py-3.5',
    '2xl': 'px-8 py-4',
  }

  const collapsedPaddingClasses: Record<ComponentSize, string> = {
    xs: 'px-2 py-1.5',
    sm: 'px-2.5 py-2',
    md: 'px-3 py-2.5',
    lg: 'px-3.5 py-3',
    xl: 'px-4 py-3.5',
    '2xl': 'px-5 py-4',
  }

  const iconSizeClasses: Record<ComponentSize, string> = {
    xs: 'w-4 h-4',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
    '2xl': 'w-6 h-6',
  }

  const handleSelect = useCallback((key: string, keyPath: string[]) => {
    if (controlledSelectedKeys === undefined) {
      setInternalSelectedKeys([key])
    }
    onSelect?.(key, keyPath)
  }, [controlledSelectedKeys, onSelect])

  const handleOpenChange = useCallback((key: string) => {
    const newOpenKeys = openKeys.includes(key)
      ? openKeys.filter((k) => k !== key)
      : [...openKeys, key]

    if (controlledOpenKeys === undefined) {
      setInternalOpenKeys(newOpenKeys)
    }
    onOpenChange?.(newOpenKeys)
  }, [openKeys, controlledOpenKeys, onOpenChange])

  const getItemStyles = (isSelected: boolean, isDisabled: boolean): React.CSSProperties => {
    if (isDisabled) {
      return {
        color: theme === 'dark' ? 'var(--lm-gray-600)' : 'var(--lm-text-disabled)',
        cursor: 'not-allowed',
      }
    }

    if (isSelected) {
      return {
        color: theme === 'dark' ? 'white' : 'var(--lm-primary-600)',
        backgroundColor: theme === 'dark' ? 'var(--lm-primary-600)' : 'var(--lm-primary-50)',
      }
    }

    return {
      color: theme === 'dark' ? 'var(--lm-gray-200)' : 'var(--lm-text-primary)',
      backgroundColor: 'transparent',
    }
  }

  const getHoverStyles = (isSelected: boolean, isDisabled: boolean): React.CSSProperties => {
    if (isDisabled || isSelected) return {}

    return {
      backgroundColor: theme === 'dark' ? 'var(--lm-gray-700)' : 'var(--lm-bg-hover)',
    }
  }

  const renderMenuItem = (item: LMMenuItem, level: number = 0, keyPath: string[] = []) => {
    if (item.type === 'divider') {
      return (
        <div
          key={item.key}
          className="my-2 mx-3 border-t"
          style={{ borderColor: theme === 'dark' ? 'var(--lm-gray-700)' : 'var(--lm-border-light)' }}
        />
      )
    }

    if (item.type === 'group') {
      return (
        <div key={item.key} className="py-2">
          <div
            className={`${collapsed ? collapsedPaddingClasses[resolvedSize] : itemPaddingClasses[resolvedSize]} text-xs font-semibold uppercase tracking-wider`}
            style={{ color: theme === 'dark' ? 'var(--lm-gray-500)' : 'var(--lm-text-tertiary)' }}
          >
            {!collapsed && item.label}
          </div>
          {item.children?.map((child) => renderMenuItem(child, level, [...keyPath, item.key]))}
        </div>
      )
    }

    const hasChildren = !!(item.children && item.children.length > 0)
    const isOpen = openKeys.includes(item.key)
    const isSelected = selectedKeys.includes(item.key)
    const currentKeyPath = [...keyPath, item.key]
    const indentStyle = !collapsed && mode === 'inline' ? { paddingLeft: `${16 + level * 16}px` } : {}

    return (
      <div key={item.key}>
        <MenuItem
          item={item}
          size={resolvedSize}
          collapsed={collapsed}
          hasChildren={hasChildren}
          isOpen={isOpen}
          isSelected={isSelected}
          theme={theme}
          mode={mode}
          paddingClass={collapsed ? collapsedPaddingClasses[resolvedSize] : itemPaddingClasses[resolvedSize]}
          textClass={SIZE_TEXT_CLASSES[resolvedSize]}
          gapClass={SIZE_GAP_CLASSES[resolvedSize]}
          iconClass={iconSizeClasses[resolvedSize]}
          indentStyle={indentStyle}
          getStyles={getItemStyles}
          getHoverStyles={getHoverStyles}
          onSelect={() => {
            if (!item.disabled && !hasChildren) {
              handleSelect(item.key, currentKeyPath)
            }
          }}
          onToggle={() => {
            if (hasChildren && !item.disabled) {
              handleOpenChange(item.key)
            }
          }}
        />

        {/* Sub menu */}
        {hasChildren && isOpen && !collapsed && mode === 'inline' && (
          <div className="overflow-hidden transition-all duration-200">
            {item.children?.map((child) => renderMenuItem(child, level + 1, currentKeyPath))}
          </div>
        )}
      </div>
    )
  }

  const containerStyles: React.CSSProperties = {
    width: collapsed ? collapsedWidth : undefined,
    backgroundColor: theme === 'dark' ? 'var(--lm-gray-900)' : 'var(--lm-bg-elevated)',
    transition: 'width 0.2s ease-in-out',
  }

  const flexDirection = mode === 'horizontal' ? 'row' : 'column'

  return (
    <nav
      className={`flex ${className}`}
      style={{
        ...containerStyles,
        flexDirection,
      }}
      role="menu"
    >
      {items.map((item) => renderMenuItem(item))}
    </nav>
  )
}

// Separate MenuItem component for hover state
interface MenuItemInternalProps {
  item: LMMenuItem
  size: ComponentSize
  collapsed: boolean
  hasChildren: boolean
  isOpen: boolean
  isSelected: boolean
  theme: 'light' | 'dark'
  mode: 'vertical' | 'horizontal' | 'inline'
  paddingClass: string
  textClass: string
  gapClass: string
  iconClass: string
  indentStyle: React.CSSProperties
  getStyles: (isSelected: boolean, isDisabled: boolean) => React.CSSProperties
  getHoverStyles: (isSelected: boolean, isDisabled: boolean) => React.CSSProperties
  onSelect: () => void
  onToggle: () => void
}

const MenuItem: React.FC<MenuItemInternalProps> = ({
  item,
  collapsed,
  hasChildren,
  isOpen,
  isSelected,
  paddingClass,
  textClass,
  gapClass,
  iconClass,
  indentStyle,
  getStyles,
  getHoverStyles,
  onSelect,
  onToggle,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const baseStyles = getStyles(isSelected, item.disabled || false)
  const hoverStyles = isHovered ? getHoverStyles(isSelected, item.disabled || false) : {}

  return (
    <div
      className={`
        ${paddingClass} ${textClass}
        flex items-center ${gapClass}
        cursor-pointer transition-colors duration-150
        rounded-lg mx-2 my-0.5
        ${collapsed ? 'justify-center' : ''}
      `}
      style={{
        ...baseStyles,
        ...hoverStyles,
        ...indentStyle,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (hasChildren) {
          onToggle()
        } else {
          onSelect()
        }
      }}
      role="menuitem"
      aria-disabled={item.disabled || undefined}
      aria-expanded={hasChildren ? isOpen : undefined}
      title={collapsed ? (typeof item.label === 'string' ? item.label : undefined) : undefined}
    >
      {item.icon && (
        <span className={`flex-shrink-0 ${iconClass}`}>{item.icon}</span>
      )}

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>

          {hasChildren && (
            <span
              className={`flex-shrink-0 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            >
              <ChevronDownIcon className="w-4 h-4" />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default LMMenu
