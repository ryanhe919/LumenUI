import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_TEXT_CLASSES,
  SIZE_INPUT_CONFIG,
  clampComponentSize,
} from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'

export interface TimePickerOptions {
  /** Show hour selector */
  showHour?: boolean
  /** Show minute selector */
  showMinute?: boolean
  /** Show second selector */
  showSecond?: boolean
  /** Hour step */
  hourStep?: number
  /** Minute step */
  minuteStep?: number
  /** Second step */
  secondStep?: number
  /** Use 12-hour format */
  use12Hours?: boolean
}

export interface LMDatePickerProps {
  /** Selected date value */
  value?: Date | string | null
  /** Default value */
  defaultValue?: Date | string
  /** Change handler */
  onChange?: (date: Date | null, dateString: string) => void
  /** Date format */
  format?: string
  /** Placeholder */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Component size */
  size?: ComponentSize
  /** Allow clear */
  allowClear?: boolean
  /** Disable specific dates */
  disabledDate?: (date: Date) => boolean
  /** Picker type (reserved for future use) */
  picker?: 'date' | 'month' | 'year'
  /** Error state */
  error?: boolean
  /** Error message */
  errorMessage?: string
  /** Custom class name */
  className?: string
  /** Enable time picker */
  showTime?: boolean | TimePickerOptions
}

const CalendarIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ClearIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

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

const DoubleChevronLeftIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 19l-7-7 7-7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7" />
  </svg>
)

const DoubleChevronRightIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 5l7 7-7 7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7" />
  </svg>
)

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

// Scrollbar styles for time columns
const timeScrollbarStyles = `
  .lm-time-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .lm-time-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .lm-time-scrollbar::-webkit-scrollbar-thumb {
    background: var(--lm-border-default);
    border-radius: 4px;
  }
  .lm-time-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--lm-text-tertiary);
  }
  .lm-time-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--lm-border-default) transparent;
  }
`

// Fixed height for time columns to match calendar height
const TIME_COLUMN_HEIGHT = 252

// TimeColumn component moved outside to avoid re-creation during render
const TimeColumn: React.FC<{
  options: number[]
  value: number
  onChange: (val: number) => void
  listRef: React.RefObject<HTMLDivElement | null>
}> = ({ options, value, onChange, listRef }) => (
  <div
    ref={listRef as React.RefObject<HTMLDivElement>}
    className="flex-1 overflow-y-auto lm-time-scrollbar"
    style={{
      height: `${TIME_COLUMN_HEIGHT}px`,
      maxHeight: `${TIME_COLUMN_HEIGHT}px`,
    }}
  >
    {options.map((opt) => (
      <button
        key={opt}
        className={`
          w-full h-8 text-sm flex items-center justify-center rounded-md
          transition-colors duration-150
          hover:bg-[var(--lm-bg-hover)]
        `}
        style={{
          backgroundColor: opt === value ? 'var(--lm-primary-500)' : 'transparent',
          color: opt === value ? 'white' : 'var(--lm-text-primary)',
        }}
        onClick={() => onChange(opt)}
      >
        {String(opt).padStart(2, '0')}
      </button>
    ))}
  </div>
)

const formatDate = (date: Date, format: string): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

const parseDate = (value: Date | string | null | undefined): Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  const parsed = new Date(value)
  return isNaN(parsed.getTime()) ? null : parsed
}

const LMDatePicker: React.FC<LMDatePickerProps> = ({
  value,
  defaultValue,
  onChange,
  format: formatProp,
  placeholder = '请选择日期',
  disabled = false,
  size = 'md',
  allowClear = true,
  disabledDate,
  picker: _picker = 'date',
  error = false,
  errorMessage,
  className = '',
  showTime = false,
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const inputConfig = SIZE_INPUT_CONFIG[resolvedSize]

  // Parse time options
  const timeOptions: TimePickerOptions = typeof showTime === 'object' ? showTime : {}
  const {
    showHour = true,
    showMinute = true,
    showSecond = true,
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
  } = timeOptions
  const hasTime = showTime !== false

  // Auto-determine format
  const format = formatProp || (hasTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')

  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<Date | null>(() => parseDate(defaultValue))
  const [viewDate, setViewDate] = useState<Date>(() => parseDate(defaultValue) || new Date())
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Time state for pending selection
  const [tempDate, setTempDate] = useState<Date | null>(null)
  // Track user-modified time separately from selected date time
  const [userModifiedTime, setUserModifiedTime] = useState<{hour: number, minute: number, second: number} | null>(null)

  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const hourListRef = useRef<HTMLDivElement>(null)
  const minuteListRef = useRef<HTMLDivElement>(null)
  const secondListRef = useRef<HTMLDivElement>(null)

  const selectedDate = value !== undefined ? parseDate(value) : internalValue

  const displayValue = selectedDate ? formatDate(selectedDate, format) : ''

  // Derive temp time values - use user modified values if set, otherwise from selectedDate
  const tempHour = userModifiedTime?.hour ?? selectedDate?.getHours() ?? 0
  const tempMinute = userModifiedTime?.minute ?? selectedDate?.getMinutes() ?? 0
  const tempSecond = userModifiedTime?.second ?? selectedDate?.getSeconds() ?? 0

  // Reset user modified time when panel closes or selection changes
  const prevSelectedDateRef = useRef(selectedDate)
  if (prevSelectedDateRef.current !== selectedDate) {
    prevSelectedDateRef.current = selectedDate
    if (userModifiedTime !== null) {
      setUserModifiedTime(null)
    }
  }

  // Scroll time columns to selected values when panel opens
  useEffect(() => {
    if (isOpen && hasTime) {
      setTimeout(() => {
        const scrollToSelected = (ref: React.RefObject<HTMLDivElement | null>, value: number, step: number) => {
          if (ref.current) {
            const index = Math.floor(value / step)
            const itemHeight = 32 // height of each item (h-8)
            ref.current.scrollTop = index * itemHeight
          }
        }
        scrollToSelected(hourListRef, tempHour, hourStep)
        scrollToSelected(minuteListRef, tempMinute, minuteStep)
        scrollToSelected(secondListRef, tempSecond, secondStep)
      }, 50)
    }
  }, [isOpen, hasTime, tempHour, tempMinute, tempSecond, hourStep, minuteStep, secondStep])

  // Update position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !dropdownRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const dropdownRect = dropdownRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    let top = triggerRect.bottom + scrollY + 4
    let left = triggerRect.left + scrollX

    // Boundary check
    if (left + dropdownRect.width > window.innerWidth + scrollX) {
      left = window.innerWidth + scrollX - dropdownRect.width - 8
    }
    if (top + dropdownRect.height > window.innerHeight + scrollY) {
      top = triggerRect.top + scrollY - dropdownRect.height - 4
    }

    setPosition({ top, left })
  }, [])

  useEffect(() => {
    if (isOpen) {
      updatePosition()
    }
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      const handleScroll = () => updatePosition()

      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleScroll)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [isOpen, updatePosition])

  const handleDateSelect = (date: Date) => {
    if (disabledDate?.(date)) return

    if (hasTime) {
      // When time picker is enabled, store temp date and wait for confirm
      setTempDate(date)
      const newDate = new Date(date)
      newDate.setHours(tempHour, tempMinute, tempSecond)
      setTempDate(newDate)
    } else {
      // No time picker, confirm immediately
      const newDate = new Date(date)
      if (value === undefined) {
        setInternalValue(newDate)
      }
      onChange?.(newDate, formatDate(newDate, format))
      setIsOpen(false)
    }
  }

  const handleTimeChange = (type: 'hour' | 'minute' | 'second', val: number) => {
    setUserModifiedTime(prev => ({
      hour: type === 'hour' ? val : (prev?.hour ?? tempHour),
      minute: type === 'minute' ? val : (prev?.minute ?? tempMinute),
      second: type === 'second' ? val : (prev?.second ?? tempSecond),
    }))
  }

  const handleConfirm = () => {
    const baseDate = tempDate || selectedDate || new Date()
    const newDate = new Date(baseDate)
    newDate.setHours(tempHour, tempMinute, tempSecond)

    if (value === undefined) {
      setInternalValue(newDate)
    }
    onChange?.(newDate, formatDate(newDate, format))
    setIsOpen(false)
  }

  const handleNow = () => {
    const now = new Date()
    setUserModifiedTime({
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
    })
    setTempDate(now)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value === undefined) {
      setInternalValue(null)
    }
    onChange?.(null, '')
  }

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handlePrevYear = () => {
    setViewDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1))
  }

  const handleNextYear = () => {
    setViewDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1))
  }

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days: { date: Date; isCurrentMonth: boolean }[] = []

    // Previous month days
    const firstDayOfWeek = firstDay.getDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({ date, isCurrentMonth: true })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({ date, isCurrentMonth: false })
    }

    return days
  }, [viewDate])

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const isSelected = (date: Date) => {
    // In time picker mode, check tempDate first for pending selection
    const checkDate = hasTime && tempDate ? tempDate : selectedDate
    if (!checkDate) return false
    return (
      date.getFullYear() === checkDate.getFullYear() &&
      date.getMonth() === checkDate.getMonth() &&
      date.getDate() === checkDate.getDate()
    )
  }

  const getInputStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      backgroundColor: 'var(--lm-bg-elevated)',
      borderColor: error ? 'var(--lm-error-300)' : 'var(--lm-border-default)',
      color: 'var(--lm-text-primary)',
    }

    if (disabled) {
      return {
        ...base,
        backgroundColor: 'var(--lm-bg-disabled)',
        cursor: 'not-allowed',
        opacity: 0.6,
      }
    }

    return base
  }

  const getDayStyles = (day: { date: Date; isCurrentMonth: boolean }): React.CSSProperties => {
    const isDisabled = disabledDate?.(day.date)
    const selected = isSelected(day.date)
    const today = isToday(day.date)

    if (isDisabled) {
      return {
        color: 'var(--lm-text-disabled)',
        cursor: 'not-allowed',
      }
    }

    if (selected) {
      return {
        backgroundColor: 'var(--lm-primary-500)',
        color: 'white',
      }
    }

    if (today) {
      return {
        color: 'var(--lm-primary-600)',
        fontWeight: 600,
      }
    }

    if (!day.isCurrentMonth) {
      return {
        color: 'var(--lm-text-tertiary)',
      }
    }

    return {
      color: 'var(--lm-text-primary)',
    }
  }

  // Generate time options
  const generateTimeOptions = (max: number, step: number) => {
    const options: number[] = []
    for (let i = 0; i < max; i += step) {
      options.push(i)
    }
    return options
  }

  const hourOptions = generateTimeOptions(24, hourStep)
  const minuteOptions = generateTimeOptions(60, minuteStep)
  const secondOptions = generateTimeOptions(60, secondStep)

  const calendar = (
    <div
      ref={dropdownRef}
      className="rounded-xl border backdrop-blur-md shadow-lg p-3"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 1000,
        backgroundColor: 'var(--lm-bg-elevated)',
        borderColor: 'var(--lm-border-default)',
        width: hasTime ? '460px' : '280px',
      }}
    >
      <style>{timeScrollbarStyles}</style>
      <div className={hasTime ? 'flex gap-3' : ''}>
        {/* Calendar Panel */}
        <div className="flex-shrink-0" style={{ width: '256px' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              className="p-1 rounded hover:bg-[var(--lm-bg-hover)] transition-colors"
              onClick={handlePrevYear}
              style={{ color: 'var(--lm-text-secondary)' }}
            >
              <DoubleChevronLeftIcon />
            </button>
            <button
              className="p-1 rounded hover:bg-[var(--lm-bg-hover)] transition-colors"
              onClick={handlePrevMonth}
              style={{ color: 'var(--lm-text-secondary)' }}
            >
              <ChevronLeftIcon />
            </button>
            <span
              className="font-medium"
              style={{ color: 'var(--lm-text-primary)' }}
            >
              {viewDate.getFullYear()} 年 {MONTHS[viewDate.getMonth()]}
            </span>
            <button
              className="p-1 rounded hover:bg-[var(--lm-bg-hover)] transition-colors"
              onClick={handleNextMonth}
              style={{ color: 'var(--lm-text-secondary)' }}
            >
              <ChevronRightIcon />
            </button>
            <button
              className="p-1 rounded hover:bg-[var(--lm-bg-hover)] transition-colors"
              onClick={handleNextYear}
              style={{ color: 'var(--lm-text-secondary)' }}
            >
              <DoubleChevronRightIcon />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium py-1"
                style={{ color: 'var(--lm-text-tertiary)' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isDisabled = disabledDate?.(day.date)
              return (
                <button
                  key={index}
                  className={`
                    w-8 h-8 rounded-lg text-sm flex items-center justify-center
                    transition-colors duration-150
                    ${!isDisabled ? 'hover:bg-[var(--lm-bg-hover)]' : ''}
                  `}
                  style={getDayStyles(day)}
                  onClick={() => handleDateSelect(day.date)}
                  disabled={isDisabled}
                >
                  {day.date.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time Picker Panel */}
        {hasTime && (
          <div
            className="border-l pl-3 flex flex-col"
            style={{ borderColor: 'var(--lm-border-light)', width: '170px' }}
          >
            <div
              className="text-xs font-medium mb-2 text-center flex-shrink-0"
              style={{ color: 'var(--lm-text-tertiary)' }}
            >
              选择时间
            </div>
            <div className="flex gap-1">
              {showHour && (
                <TimeColumn
                  options={hourOptions}
                  value={tempHour}
                  onChange={(val) => handleTimeChange('hour', val)}
                  listRef={hourListRef}
                />
              )}
              {showMinute && (
                <TimeColumn
                  options={minuteOptions}
                  value={tempMinute}
                  onChange={(val) => handleTimeChange('minute', val)}
                  listRef={minuteListRef}
                />
              )}
              {showSecond && (
                <TimeColumn
                  options={secondOptions}
                  value={tempSecond}
                  onChange={(val) => handleTimeChange('second', val)}
                  listRef={secondListRef}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--lm-border-light)' }}>
        <button
          className="py-1.5 px-3 text-sm rounded-lg hover:bg-[var(--lm-bg-hover)] transition-colors"
          style={{ color: 'var(--lm-primary-600)' }}
          onClick={hasTime ? handleNow : () => handleDateSelect(new Date())}
        >
          {hasTime ? '此刻' : '今天'}
        </button>
        {hasTime && (
          <button
            className="py-1.5 px-4 text-sm rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--lm-primary-500)',
              color: 'white',
            }}
            onClick={handleConfirm}
          >
            确定
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className={`inline-block ${className}`}>
      <div
        ref={triggerRef}
        className={`
          ${inputConfig.padding} ${inputConfig.height} ${inputConfig.fontSize}
          rounded-xl border backdrop-blur-md
          flex items-center gap-2
          transition-all duration-200
          ${disabled ? '' : 'cursor-pointer'}
        `}
        style={getInputStyles()}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          className="flex-1 truncate"
          style={{ color: displayValue ? 'var(--lm-text-primary)' : 'var(--lm-text-tertiary)' }}
        >
          {displayValue || placeholder}
        </span>

        {allowClear && displayValue && isHovered && !disabled ? (
          <span
            className="flex-shrink-0 p-0.5 rounded hover:bg-[var(--lm-bg-hover)]"
            style={{ color: 'var(--lm-text-tertiary)' }}
            onClick={handleClear}
          >
            <ClearIcon />
          </span>
        ) : (
          <span
            className="flex-shrink-0"
            style={{ color: 'var(--lm-text-tertiary)' }}
          >
            <CalendarIcon />
          </span>
        )}
      </div>

      {/* Error message */}
      {error && errorMessage && (
        <p
          className={`mt-1 ${SIZE_TEXT_CLASSES[resolvedSize]}`}
          style={{ color: 'var(--lm-error-500)' }}
        >
          {errorMessage}
        </p>
      )}

      {/* Calendar dropdown */}
      {isOpen && typeof document !== 'undefined' && createPortal(calendar, document.body)}
    </div>
  )
}

export default LMDatePicker
