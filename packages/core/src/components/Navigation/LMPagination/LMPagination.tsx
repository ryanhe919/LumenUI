import React, { useState, useCallback, useMemo } from 'react'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_TEXT_CLASSES,
  SIZE_GAP_CLASSES,
  clampComponentSize,
} from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'

export interface LMPaginationProps {
  /** Current page number */
  current: number
  /** Total number of items */
  total: number
  /** Number of items per page */
  pageSize?: number
  /** Page size options */
  pageSizeOptions?: number[]
  /** Show quick jumper */
  showQuickJumper?: boolean
  /** Show page size changer */
  showSizeChanger?: boolean
  /** Show total count */
  showTotal?: boolean | ((total: number, range: [number, number]) => React.ReactNode)
  /** Component size */
  size?: ComponentSize
  /** Simple mode - only shows prev/next */
  simple?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Change handler */
  onChange?: (page: number, pageSize: number) => void
  /** Custom class name */
  className?: string
}

const ChevronLeftIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

const MoreIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" />
  </svg>
)

const LMPagination: React.FC<LMPaginationProps> = ({
  current,
  total,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  showSizeChanger = false,
  showTotal = false,
  size = 'md',
  simple = false,
  disabled = false,
  onChange,
  className = '',
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const [jumpValue, setJumpValue] = useState('')
  const [internalPageSize, setInternalPageSize] = useState(pageSize)

  const totalPages = Math.ceil(total / internalPageSize)

  const buttonSizeClasses: Record<ComponentSize, string> = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-7 h-7 text-sm',
    md: 'w-8 h-8 text-sm',
    lg: 'w-9 h-9 text-base',
    xl: 'w-10 h-10 text-base',
    '2xl': 'w-12 h-12 text-lg',
  }

  const inputSizeClasses: Record<ComponentSize, string> = {
    xs: 'w-10 h-6 text-xs px-1',
    sm: 'w-12 h-7 text-sm px-1',
    md: 'w-14 h-8 text-sm px-2',
    lg: 'w-16 h-9 text-base px-2',
    xl: 'w-18 h-10 text-base px-2',
    '2xl': 'w-20 h-12 text-lg px-3',
  }

  const handlePageChange = useCallback((page: number) => {
    if (disabled || page < 1 || page > totalPages || page === current) return
    onChange?.(page, internalPageSize)
  }, [disabled, totalPages, current, onChange, internalPageSize])

  const handlePageSizeChange = useCallback((newSize: number) => {
    setInternalPageSize(newSize)
    const newTotalPages = Math.ceil(total / newSize)
    const newCurrent = Math.min(current, newTotalPages)
    onChange?.(newCurrent, newSize)
  }, [total, current, onChange])

  const handleJump = useCallback(() => {
    const page = parseInt(jumpValue, 10)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page)
    }
    setJumpValue('')
  }, [jumpValue, totalPages, handlePageChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJump()
    }
  }, [handleJump])

  // Calculate visible page numbers
  const pageNumbers = useMemo(() => {
    const pages: (number | 'prev-more' | 'next-more')[] = []
    const showPrevMore = current > 4
    const showNextMore = current < totalPages - 3

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (showPrevMore) {
        pages.push('prev-more')
      }

      const start = showPrevMore ? Math.max(2, current - 1) : 2
      const end = showNextMore ? Math.min(totalPages - 1, current + 1) : totalPages - 1

      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i)
        }
      }

      if (showNextMore) {
        pages.push('next-more')
      }

      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }, [current, totalPages])

  const getButtonStyles = (isActive: boolean, isDisabled: boolean): React.CSSProperties => {
    if (isDisabled) {
      return {
        backgroundColor: 'transparent',
        color: 'var(--lm-text-disabled)',
        cursor: 'not-allowed',
      }
    }
    if (isActive) {
      return {
        backgroundColor: 'var(--lm-primary-500)',
        color: 'white',
        borderColor: 'var(--lm-primary-500)',
      }
    }
    return {
      backgroundColor: 'var(--lm-bg-elevated)',
      color: 'var(--lm-text-primary)',
      borderColor: 'var(--lm-border-default)',
    }
  }

  const getButtonHoverStyles = (): React.CSSProperties => ({
    backgroundColor: 'var(--lm-bg-hover)',
    borderColor: 'var(--lm-primary-400)',
    color: 'var(--lm-primary-600)',
  })

  const range: [number, number] = [
    Math.min((current - 1) * internalPageSize + 1, total),
    Math.min(current * internalPageSize, total),
  ]

  // Simple mode
  if (simple) {
    return (
      <div className={`flex items-center ${SIZE_GAP_CLASSES[resolvedSize]} ${className}`}>
        <button
          className={`${buttonSizeClasses[resolvedSize]} rounded-lg border flex items-center justify-center transition-all duration-200`}
          style={getButtonStyles(false, disabled || current <= 1)}
          onClick={() => handlePageChange(current - 1)}
          disabled={disabled || current <= 1}
          onMouseEnter={(e) => {
            if (!disabled && current > 1) Object.assign(e.currentTarget.style, getButtonHoverStyles())
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, getButtonStyles(false, disabled || current <= 1))
          }}
        >
          <ChevronLeftIcon />
        </button>
        <span
          className={SIZE_TEXT_CLASSES[resolvedSize]}
          style={{ color: 'var(--lm-text-primary)' }}
        >
          {current} / {totalPages}
        </span>
        <button
          className={`${buttonSizeClasses[resolvedSize]} rounded-lg border flex items-center justify-center transition-all duration-200`}
          style={getButtonStyles(false, disabled || current >= totalPages)}
          onClick={() => handlePageChange(current + 1)}
          disabled={disabled || current >= totalPages}
          onMouseEnter={(e) => {
            if (!disabled && current < totalPages) Object.assign(e.currentTarget.style, getButtonHoverStyles())
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, getButtonStyles(false, disabled || current >= totalPages))
          }}
        >
          <ChevronRightIcon />
        </button>
      </div>
    )
  }

  return (
    <div className={`flex items-center flex-wrap ${SIZE_GAP_CLASSES[resolvedSize]} ${className}`}>
      {/* Total count */}
      {showTotal && (
        <span
          className={`${SIZE_TEXT_CLASSES[resolvedSize]} mr-2`}
          style={{ color: 'var(--lm-text-secondary)' }}
        >
          {typeof showTotal === 'function'
            ? showTotal(total, range)
            : `共 ${total} 条`}
        </span>
      )}

      {/* Previous button */}
      <button
        className={`${buttonSizeClasses[resolvedSize]} rounded-lg border flex items-center justify-center transition-all duration-200`}
        style={getButtonStyles(false, disabled || current <= 1)}
        onClick={() => handlePageChange(current - 1)}
        disabled={disabled || current <= 1}
        aria-label="上一页"
        onMouseEnter={(e) => {
          if (!disabled && current > 1) Object.assign(e.currentTarget.style, getButtonHoverStyles())
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, getButtonStyles(false, disabled || current <= 1))
        }}
      >
        <ChevronLeftIcon />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === 'prev-more' || page === 'next-more') {
          return (
            <button
              key={`more-${index}`}
              className={`${buttonSizeClasses[resolvedSize]} rounded-lg flex items-center justify-center`}
              style={{ color: 'var(--lm-text-secondary)' }}
              onClick={() => handlePageChange(page === 'prev-more' ? current - 5 : current + 5)}
              disabled={disabled}
            >
              <MoreIcon />
            </button>
          )
        }

        const isActive = page === current
        return (
          <button
            key={page}
            className={`${buttonSizeClasses[resolvedSize]} rounded-lg border flex items-center justify-center transition-all duration-200`}
            style={getButtonStyles(isActive, disabled)}
            onClick={() => handlePageChange(page)}
            disabled={disabled}
            aria-current={isActive ? 'page' : undefined}
            onMouseEnter={(e) => {
              if (!disabled && !isActive) Object.assign(e.currentTarget.style, getButtonHoverStyles())
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, getButtonStyles(isActive, disabled))
            }}
          >
            {page}
          </button>
        )
      })}

      {/* Next button */}
      <button
        className={`${buttonSizeClasses[resolvedSize]} rounded-lg border flex items-center justify-center transition-all duration-200`}
        style={getButtonStyles(false, disabled || current >= totalPages)}
        onClick={() => handlePageChange(current + 1)}
        disabled={disabled || current >= totalPages}
        aria-label="下一页"
        onMouseEnter={(e) => {
          if (!disabled && current < totalPages) Object.assign(e.currentTarget.style, getButtonHoverStyles())
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, getButtonStyles(false, disabled || current >= totalPages))
        }}
      >
        <ChevronRightIcon />
      </button>

      {/* Page size changer */}
      {showSizeChanger && (
        <select
          className={`${inputSizeClasses[resolvedSize]} rounded-lg border outline-none transition-all duration-200`}
          style={{
            backgroundColor: 'var(--lm-bg-elevated)',
            color: 'var(--lm-text-primary)',
            borderColor: 'var(--lm-border-default)',
          }}
          value={internalPageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          disabled={disabled}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option} 条/页
            </option>
          ))}
        </select>
      )}

      {/* Quick jumper */}
      {showQuickJumper && (
        <div className={`flex items-center ${SIZE_GAP_CLASSES[resolvedSize]}`}>
          <span
            className={SIZE_TEXT_CLASSES[resolvedSize]}
            style={{ color: 'var(--lm-text-secondary)' }}
          >
            跳至
          </span>
          <input
            type="text"
            className={`${inputSizeClasses[resolvedSize]} rounded-lg border outline-none text-center transition-all duration-200`}
            style={{
              backgroundColor: 'var(--lm-bg-elevated)',
              color: 'var(--lm-text-primary)',
              borderColor: 'var(--lm-border-default)',
            }}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value.replace(/\D/g, ''))}
            onBlur={handleJump}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
          <span
            className={SIZE_TEXT_CLASSES[resolvedSize]}
            style={{ color: 'var(--lm-text-secondary)' }}
          >
            页
          </span>
        </div>
      )}
    </div>
  )
}

export default LMPagination
