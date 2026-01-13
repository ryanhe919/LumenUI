import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import { SIZE_TABLE_CONFIG, SIZE_TEXT_CLASSES } from '../../utils/componentSizes'
import type { ComponentSize } from '../../utils/componentSizes'

export interface LMTableColumn<T = Record<string, unknown>> {
  /** Column title */
  title: string
  /** Data field name */
  dataIndex: string
  /** Column width */
  width?: string | number
  /** Custom render function */
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  /** Sortable */
  sorter?: boolean
  /** Column alignment */
  align?: 'left' | 'center' | 'right'
  /** Fixed column */
  fixed?: 'left' | 'right'
}

export interface LMPaginationConfig {
  /** Current page */
  current: number
  /** Page size */
  pageSize: number
  /** Total count */
  total: number
  /** Show pagination */
  showPagination?: boolean
  /** Page size options */
  pageSizeOptions?: number[]
  /** Show total */
  showTotal?: boolean
  /** Show quick jumper */
  showQuickJumper?: boolean
  /** Show size changer */
  showSizeChanger?: boolean
  /** Change callback */
  onChange?: (page: number, pageSize: number) => void
}

export interface LMLoadMoreConfig {
  /** Enable load more */
  enabled: boolean
  /** Threshold */
  threshold?: number
  /** Has more data */
  hasMore: boolean
  /** Loading state */
  loading: boolean
  /** Load more callback */
  onLoadMore: () => void
}

export interface LMTableProps<T = Record<string, unknown>> {
  /** Data source */
  dataSource: T[]
  /** Columns */
  columns: LMTableColumn<T>[]
  /** Row key */
  rowKey?: string | ((record: T, index: number) => string)
  /** Pagination config */
  pagination?: LMPaginationConfig
  /** Load more config */
  loadMore?: LMLoadMoreConfig
  /** Loading state */
  loading?: boolean
  /** Empty text */
  emptyText?: string
  /** Size */
  size?: ComponentSize
  /** Bordered */
  bordered?: boolean
  /** Striped */
  striped?: boolean
  /** Selectable */
  selectable?: boolean
  /** Selected row keys */
  selectedRowKeys?: string[]
  /** Selection change callback */
  onSelectionChange?: (selectedRowKeys: string[], selectedRows: T[]) => void
  /** Row click callback */
  onRowClick?: (record: T, index: number) => void
  /** Sort change callback */
  onSortChange?: (field: string, order: 'ascend' | 'descend') => void
  /** Class name */
  className?: string
  /** Full height */
  fullHeight?: boolean
  /** Variant */
  variant?: 'default' | 'elevated' | 'outline' | 'minimal' | 'soft' | 'zebra'
}

const CaretUpIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg
    className="w-2.5 h-2.5"
    viewBox="0 0 10 6"
    fill="none"
    style={{ color: active ? 'var(--lm-primary-500)' : 'var(--lm-gray-400)' }}
  >
    <path d="M5 0L10 6H0L5 0Z" fill="currentColor" />
  </svg>
)

const CaretDownIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg
    className="w-2.5 h-2.5"
    viewBox="0 0 10 6"
    fill="none"
    style={{ color: active ? 'var(--lm-primary-500)' : 'var(--lm-gray-400)' }}
  >
    <path d="M5 6L0 0H10L5 6Z" fill="currentColor" />
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

const SpinnerIcon: React.FC = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const LMTable = <T = unknown,>({
  dataSource,
  columns,
  rowKey = 'id',
  pagination,
  loadMore,
  loading = false,
  emptyText = 'No data',
  size = 'md',
  bordered = false,
  striped = false,
  selectable = false,
  selectedRowKeys = [],
  onSelectionChange,
  onRowClick,
  onSortChange,
  className = '',
  fullHeight = false,
  variant = 'default',
}: LMTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend')
  const containerRef = useRef<HTMLDivElement>(null)

  const getRowKey = useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(record, index)
      }
      const key = (record as unknown as Record<string, unknown>)[rowKey as string]
      return (typeof key === 'string' ? key : String(key)) || index.toString()
    },
    [rowKey]
  )

  const getValueByDataIndex = useCallback((record: T, dataIndex: string) => {
    const parts = String(dataIndex).split('.')
    let current: unknown = record as unknown as Record<string, unknown>
    for (const p of parts) {
      if (
        current == null ||
        typeof current !== 'object' ||
        !(p in (current as Record<string, unknown>))
      ) {
        return ''
      }
      current = (current as Record<string, unknown>)[p]
    }
    return current as unknown
  }, [])

  const handleSort = useCallback(
    (column: LMTableColumn<T>) => {
      if (!column.sorter) return

      let newSortOrder: 'ascend' | 'descend' = 'ascend'
      if (sortField === column.dataIndex) {
        newSortOrder = sortOrder === 'ascend' ? 'descend' : 'ascend'
      }

      setSortField(column.dataIndex)
      setSortOrder(newSortOrder)
      onSortChange?.(column.dataIndex, newSortOrder)
    },
    [sortField, sortOrder, onSortChange]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      pagination?.onChange?.(page, pageSize)
    },
    [pagination, pageSize]
  )

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize)
      setCurrentPage(1)
      pagination?.onChange?.(1, newPageSize)
    },
    [pagination]
  )

  const handleRowSelect = useCallback(
    (record: T, checked: boolean) => {
      const key = getRowKey(record, dataSource.indexOf(record))
      let newSelectedRowKeys: string[]

      if (checked) {
        newSelectedRowKeys = [...selectedRowKeys, key]
      } else {
        newSelectedRowKeys = selectedRowKeys.filter((k) => k !== key)
      }

      const newSelectedRows = dataSource.filter((item) =>
        newSelectedRowKeys.includes(getRowKey(item, dataSource.indexOf(item)))
      )

      onSelectionChange?.(newSelectedRowKeys, newSelectedRows)
    },
    [selectedRowKeys, dataSource, getRowKey, onSelectionChange]
  )

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allKeys = dataSource.map((record, index) => getRowKey(record, index))
        onSelectionChange?.(allKeys, dataSource)
      } else {
        onSelectionChange?.([], [])
      }
    },
    [dataSource, getRowKey, onSelectionChange]
  )

  const handleScroll = useCallback(() => {
    if (!loadMore?.enabled || loadMore.loading || !loadMore.hasMore) return

    const container = containerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const threshold = loadMore.threshold || 100

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadMore.onLoadMore()
    }
  }, [loadMore])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !loadMore?.enabled) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll, loadMore?.enabled, loadMore?.loading, loadMore?.hasMore])

  useEffect(() => {
    if (pagination?.current !== undefined) {
      setCurrentPage(pagination.current)
    }
    if (pagination?.pageSize !== undefined) {
      setPageSize(pagination.pageSize)
    }
  }, [pagination])

  const paginationUiClasses = {
    xs: {
      container: 'px-3 py-2',
      text: 'text-xs',
      control: 'px-2 py-1 text-xs',
      gap: 'gap-1',
      select: 'px-2 py-1 text-xs',
      input: 'px-2 py-1 text-xs w-14',
    },
    sm: {
      container: 'px-3 py-2',
      text: 'text-sm',
      control: 'px-2 py-1 text-sm',
      gap: 'gap-2',
      select: 'px-2 py-1 text-sm',
      input: 'px-2 py-1 text-sm w-16',
    },
    md: {
      container: 'px-4 py-3',
      text: 'text-sm',
      control: 'px-3 py-1 text-sm',
      gap: 'gap-2',
      select: 'px-2 py-1 text-sm',
      input: 'px-2 py-1 text-sm w-16',
    },
    lg: {
      container: 'px-5 py-3.5',
      text: 'text-base',
      control: 'px-3.5 py-1.5 text-base',
      gap: 'gap-3',
      select: 'px-3 py-1.5 text-base',
      input: 'px-3 py-1.5 text-base w-20',
    },
    xl: {
      container: 'px-6 py-4',
      text: 'text-lg',
      control: 'px-4 py-2 text-lg',
      gap: 'gap-3',
      select: 'px-4 py-2 text-lg',
      input: 'px-4 py-2 text-lg w-24',
    },
    '2xl': {
      container: 'px-8 py-5',
      text: 'text-xl',
      control: 'px-5 py-2.5 text-xl',
      gap: 'gap-4',
      select: 'px-5 py-2.5 text-xl',
      input: 'px-5 py-2.5 text-xl w-28',
    },
  } as const

  const totalPages =
    pagination && pagination.total && pageSize
      ? Math.max(1, Math.ceil(pagination.total / pageSize))
      : 1

  const getTableStyles = () => ({
    backgroundColor:
      variant === 'minimal'
        ? 'transparent'
        : variant === 'soft'
          ? 'var(--lm-bg-paper)'
          : 'var(--lm-bg-elevated)',
    borderColor:
      variant === 'outline'
        ? 'var(--lm-border-strong)'
        : bordered
          ? 'var(--lm-border-default)'
          : 'transparent',
  })

  const getHeaderStyles = () => ({
    backgroundColor: variant === 'minimal' ? 'transparent' : 'var(--lm-bg-elevated)',
    color: 'var(--lm-text-primary)',
    borderColor: variant === 'outline' ? 'var(--lm-border-strong)' : 'var(--lm-border-light)',
  })

  const getCellStyles = (isHeader = false) => ({
    backgroundColor: isHeader
      ? variant === 'minimal'
        ? 'transparent'
        : 'var(--lm-bg-paper)'
      : variant === 'minimal'
        ? 'transparent'
        : variant === 'soft'
          ? 'var(--lm-bg-paper)'
          : 'var(--lm-bg-elevated)',
    color: 'var(--lm-text-primary)',
    borderColor:
      variant === 'outline'
        ? 'var(--lm-border-strong)'
        : variant === 'minimal'
          ? 'transparent'
          : 'var(--lm-border-light)',
  })

  const getRowStyles = (index: number, isSelected = false) => {
    const baseStyles = {
      backgroundColor: isSelected
        ? 'var(--lm-primary-50)'
        : (striped || variant === 'zebra') && index % 2 === 1
          ? 'var(--lm-bg-paper)'
          : variant === 'minimal'
            ? 'transparent'
            : variant === 'soft'
              ? 'var(--lm-bg-paper)'
              : 'var(--lm-bg-elevated)',
      color: 'var(--lm-text-primary)',
    }

    if (isSelected) {
      return {
        ...baseStyles,
        borderColor: 'var(--lm-primary-200)',
      }
    }

    return baseStyles
  }

  const getPaginationStyles = () => ({
    backgroundColor:
      variant === 'minimal'
        ? 'transparent'
        : variant === 'soft'
          ? 'var(--lm-bg-paper)'
          : 'var(--lm-bg-elevated)',
    color: 'var(--lm-text-primary)',
    borderColor: variant === 'outline' ? 'var(--lm-border-strong)' : 'var(--lm-border-default)',
    boxShadow: variant === 'elevated' ? 'var(--lm-shadow-md)' : undefined,
  })

  const getButtonStyles = (disabled = false, active = false) => {
    if (disabled) {
      return {
        backgroundColor: 'var(--lm-bg-paper)',
        color: 'var(--lm-text-disabled)',
        borderColor: 'var(--lm-border-light)',
        cursor: 'not-allowed',
        opacity: 0.6,
      }
    }

    if (active) {
      return {
        backgroundColor: 'var(--lm-primary-500)',
        color: 'white',
        borderColor: 'var(--lm-primary-500)',
      }
    }

    return {
      backgroundColor: 'var(--lm-bg-paper)',
      color: 'var(--lm-text-primary)',
      borderColor: 'var(--lm-border-default)',
    }
  }

  const getLoadingStyles = () => ({
    color: 'var(--lm-text-secondary)',
  })

  const getEmptyStyles = () => ({
    color: 'var(--lm-text-secondary)',
  })

  const tableClassName = `w-full ${SIZE_TEXT_CLASSES[size]} border-collapse ${className}`
    .trim()
    .replace(/\s+/g, ' ')

  const isAllSelected = dataSource.length > 0 && selectedRowKeys.length === dataSource.length

  const isIndeterminate =
    selectedRowKeys.length > 0 && selectedRowKeys.length < dataSource.length

  const rootClassName = `space-y-4 ${fullHeight ? 'h-full flex flex-col min-h-0' : ''}`
    .trim()
    .replace(/\s+/g, ' ')

  const tableContainerClassName = `${
    fullHeight
      ? 'flex-1 min-h-0 overflow-auto'
      : `overflow-auto ${loadMore?.enabled ? 'max-h-96' : ''}`
  }`
    .trim()
    .replace(/\s+/g, ' ')

  const wrapperVariantClasses = (() => {
    switch (variant) {
      case 'elevated':
        return 'rounded-2xl border shadow-lg'
      case 'outline':
        return 'rounded-xl border'
      case 'soft':
        return 'rounded-xl border'
      case 'minimal':
        return 'rounded-xl'
      case 'zebra':
        return 'rounded-xl border'
      default:
        return ''
    }
  })()

  return (
    <div className={rootClassName}>
      <div
        ref={containerRef}
        className={`${tableContainerClassName} ${wrapperVariantClasses}`}
        style={{ borderColor: 'var(--lm-border-default)' }}
      >
        <table className={tableClassName} style={getTableStyles()}>
          <thead className="sticky top-0 z-20" style={getHeaderStyles()}>
            <tr>
              {selectable && (
                <th
                  className={`${SIZE_TABLE_CONFIG[size].cellPadding} py-3 ${SIZE_TEXT_CLASSES[size]} text-left ${bordered ? 'border-r' : ''} font-semibold`}
                  style={getCellStyles(true)}
                >
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4"
                    style={{ accentColor: 'var(--lm-primary-500)' }}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.dataIndex}
                  className={`${SIZE_TABLE_CONFIG[size].cellPadding} py-3 text-left ${bordered ? 'border-r' : ''} ${
                    column.sorter ? 'cursor-pointer hover:bg-opacity-60' : ''
                  } font-semibold`}
                  style={{
                    ...getCellStyles(true),
                    width: column.width,
                    textAlign: column.align || 'left',
                    fontSize:
                      size === 'xs'
                        ? '0.8125rem'
                        : size === 'sm'
                          ? '0.875rem'
                          : '0.9375rem',
                  }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sorter && (
                      <div className="flex flex-col -space-y-1">
                        <CaretUpIcon
                          active={sortField === column.dataIndex && sortOrder === 'ascend'}
                        />
                        <CaretDownIcon
                          active={sortField === column.dataIndex && sortOrder === 'descend'}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className={`px-4 py-8 text-center ${SIZE_TEXT_CLASSES[size]}`}
                  style={getLoadingStyles()}
                >
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerIcon />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : dataSource.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className={`px-4 py-8 text-center ${SIZE_TEXT_CLASSES[size]}`}
                  style={getEmptyStyles()}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              dataSource.map((record, index) => {
                const key = getRowKey(record, index)
                const isSelected = selectedRowKeys.includes(key)
                const isLastRow = index === dataSource.length - 1

                return (
                  <tr
                    key={key}
                    className={`${onRowClick ? 'cursor-pointer hover:bg-opacity-60' : ''} transition-colors border-t ${isLastRow ? 'border-b' : ''}`}
                    style={{
                      ...getRowStyles(index, isSelected),
                      borderColor: 'var(--lm-border-light)',
                    }}
                    onClick={() => onRowClick?.(record, index)}
                  >
                    {selectable && (
                      <td
                        className={`${SIZE_TABLE_CONFIG[size].cellPadding} ${SIZE_TEXT_CLASSES[size]} ${bordered ? 'border-r' : ''}`}
                        style={getCellStyles()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelect(record, e.target.checked)}
                          className="w-4 h-4"
                          style={{ accentColor: 'var(--lm-primary-500)' }}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.dataIndex}
                        className={`${SIZE_TABLE_CONFIG[size].cellPadding} ${SIZE_TEXT_CLASSES[size]} ${bordered ? 'border-r' : ''}`}
                        style={{
                          ...getCellStyles(),
                          textAlign: column.align || 'left',
                        }}
                      >
                        {column.render
                          ? column.render(
                              getValueByDataIndex(record, column.dataIndex),
                              record,
                              index
                            )
                          : String(getValueByDataIndex(record, column.dataIndex) ?? '')}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination?.showPagination && (
        <div
          className={`flex items-center justify-between ${paginationUiClasses[size].container} rounded-2xl border`}
          style={getPaginationStyles()}
        >
          {(() => {
            const maxButtons = 5
            const half = Math.floor(maxButtons / 2)
            let start = Math.max(1, currentPage - half)
            const end = Math.min(totalPages, start + maxButtons - 1)
            if (end - start + 1 < maxButtons) {
              start = Math.max(1, end - maxButtons + 1)
            }
            const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i)

            return (
              <>
                <div className="flex items-center gap-4">
                  {pagination.showTotal && (
                    <span
                      className={paginationUiClasses[size].text}
                      style={{ color: 'var(--lm-text-secondary)' }}
                    >
                      Total {pagination.total} items / {totalPages} pages
                    </span>
                  )}
                  {pagination.showSizeChanger && (
                    <div className="flex items-center gap-2">
                      <span
                        className={paginationUiClasses[size].text}
                        style={{ color: 'var(--lm-text-secondary)' }}
                      >
                        Show:
                      </span>
                      <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className={`${paginationUiClasses[size].select} border rounded-lg focus:ring-2 focus:ring-primary-400 focus:outline-none`}
                        style={{
                          backgroundColor: 'var(--lm-bg-paper)',
                          color: 'var(--lm-text-primary)',
                          borderColor: 'var(--lm-border-default)',
                        }}
                      >
                        {pagination.pageSizeOptions?.map((s) => (
                          <option key={s} value={s}>
                            {s} / page
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className={`flex items-center ${paginationUiClasses[size].gap}`}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`${paginationUiClasses[size].control} border rounded-lg transition-colors`}
                    style={getButtonStyles(currentPage <= 1)}
                    aria-label="Previous page"
                    title="Previous page"
                  >
                    <ChevronLeftIcon />
                  </button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`${paginationUiClasses[size].control} border rounded-lg transition-colors ${currentPage === page ? 'font-medium' : ''}`}
                      style={getButtonStyles(false, currentPage === page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`${paginationUiClasses[size].control} border rounded-lg transition-colors`}
                    style={getButtonStyles(currentPage >= totalPages)}
                    aria-label="Next page"
                    title="Next page"
                  >
                    <ChevronRightIcon />
                  </button>

                  {pagination.showQuickJumper && (
                    <div className={`flex items-center ${paginationUiClasses[size].gap} ml-4`}>
                      <span
                        className={paginationUiClasses[size].text}
                        style={{ color: 'var(--lm-text-secondary)' }}
                      >
                        Go to:
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        className={`${paginationUiClasses[size].input} border rounded-lg focus:ring-2 focus:ring-primary-400 focus:outline-none`}
                        style={{
                          backgroundColor: 'var(--lm-bg-paper)',
                          color: 'var(--lm-text-primary)',
                          borderColor: 'var(--lm-border-default)',
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const page = Number(e.currentTarget.value)
                            if (page >= 1 && page <= totalPages) {
                              handlePageChange(page)
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </>
            )
          })()}
        </div>
      )}

      {loadMore?.enabled && loadMore.hasMore && (
        <div className="text-center py-4">
          <button
            onClick={loadMore.onLoadMore}
            disabled={loadMore.loading}
            className="px-6 py-2 text-sm border rounded-2xl transition-colors"
            style={getButtonStyles(loadMore.loading)}
          >
            {loadMore.loading ? (
              <div className="flex items-center gap-2">
                <SpinnerIcon />
                Loading...
              </div>
            ) : (
              'Load more'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default memo(LMTable) as typeof LMTable
