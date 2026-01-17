import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMTable from './LMTable'

interface TestData {
  id: string
  name: string
  age: number
  email: string
}

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Email', dataIndex: 'email' },
]

const dataSource: TestData[] = [
  { id: '1', name: 'John Doe', age: 30, email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', age: 25, email: 'jane@example.com' },
  { id: '3', name: 'Bob Wilson', age: 35, email: 'bob@example.com' },
]

describe('LMTable', () => {
  it('renders column headers', () => {
    render(<LMTable dataSource={dataSource} columns={columns} />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    render(<LMTable dataSource={dataSource} columns={columns} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  it('renders empty text when no data', () => {
    render(<LMTable dataSource={[]} columns={columns} emptyText="No records found" />)

    expect(screen.getByText('No records found')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(<LMTable dataSource={dataSource} columns={columns} loading />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom rowKey', () => {
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        rowKey="email"
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders with rowKey function', () => {
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => `custom-${record.id}`}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('calls onRowClick when row is clicked', () => {
    const handleRowClick = vi.fn()
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        onRowClick={handleRowClick}
      />
    )

    fireEvent.click(screen.getByText('John Doe').closest('tr')!)
    expect(handleRowClick).toHaveBeenCalledWith(dataSource[0], 0)
  })

  it('renders custom cell content with render function', () => {
    const columnsWithRender = [
      ...columns,
      {
        title: 'Actions',
        dataIndex: 'id',
        render: () => <button data-testid="action-btn">Edit</button>,
      },
    ]

    render(<LMTable dataSource={dataSource} columns={columnsWithRender} />)

    const actionButtons = screen.getAllByTestId('action-btn')
    expect(actionButtons).toHaveLength(3)
  })

  it('handles sortable columns', () => {
    const handleSortChange = vi.fn()
    const sortableColumns = [
      { title: 'Name', dataIndex: 'name', sorter: true },
      { title: 'Age', dataIndex: 'age' },
    ]

    render(
      <LMTable
        dataSource={dataSource}
        columns={sortableColumns}
        onSortChange={handleSortChange}
      />
    )

    fireEvent.click(screen.getByText('Name'))
    expect(handleSortChange).toHaveBeenCalledWith('name', 'ascend')

    fireEvent.click(screen.getByText('Name'))
    expect(handleSortChange).toHaveBeenCalledWith('name', 'descend')
  })

  it('renders selectable table with checkboxes', () => {
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        selectable
        selectedRowKeys={[]}
        onSelectionChange={vi.fn()}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(4) // 1 header + 3 rows
  })

  it('handles row selection', () => {
    const handleSelectionChange = vi.fn()
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        selectable
        selectedRowKeys={[]}
        onSelectionChange={handleSelectionChange}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1]) // First data row checkbox

    expect(handleSelectionChange).toHaveBeenCalled()
    const [selectedKeys, selectedRows] = handleSelectionChange.mock.calls[0]
    expect(selectedKeys).toContain('1')
    expect(selectedRows).toHaveLength(1)
  })

  it('handles select all', () => {
    const handleSelectionChange = vi.fn()
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        selectable
        selectedRowKeys={[]}
        onSelectionChange={handleSelectionChange}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0]) // Header checkbox

    expect(handleSelectionChange).toHaveBeenCalled()
    const [selectedKeys] = handleSelectionChange.mock.calls[0]
    expect(selectedKeys).toHaveLength(3)
  })

  it('renders pagination when configured', () => {
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: 1,
          pageSize: 10,
          total: 100,
          showPagination: true,
        }}
      />
    )

    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
  })

  it('handles page change', () => {
    const handleChange = vi.fn()
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: 1,
          pageSize: 10,
          total: 100,
          showPagination: true,
          onChange: handleChange,
        }}
      />
    )

    fireEvent.click(screen.getByText('2'))
    expect(handleChange).toHaveBeenCalledWith(2, 10)
  })

  it('shows total when showTotal is true', () => {
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: 1,
          pageSize: 10,
          total: 100,
          showPagination: true,
          showTotal: true,
        }}
      />
    )

    expect(screen.getByText(/Total 100 items/)).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(
      <LMTable dataSource={dataSource} columns={columns} size="sm" />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()

    rerender(<LMTable dataSource={dataSource} columns={columns} size="lg" />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(
      <LMTable dataSource={dataSource} columns={columns} variant="elevated" />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()

    rerender(<LMTable dataSource={dataSource} columns={columns} variant="minimal" />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders bordered table', () => {
    render(<LMTable dataSource={dataSource} columns={columns} bordered />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders striped table', () => {
    render(<LMTable dataSource={dataSource} columns={columns} striped />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders load more button when enabled', () => {
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        loadMore={{
          enabled: true,
          hasMore: true,
          loading: false,
          onLoadMore: vi.fn(),
        }}
      />
    )

    expect(screen.getByText('Load more')).toBeInTheDocument()
  })

  it('calls onLoadMore when load more button is clicked', () => {
    const handleLoadMore = vi.fn()
    render(
      <LMTable
        dataSource={dataSource}
        columns={columns}
        loadMore={{
          enabled: true,
          hasMore: true,
          loading: false,
          onLoadMore: handleLoadMore,
        }}
      />
    )

    fireEvent.click(screen.getByText('Load more'))
    expect(handleLoadMore).toHaveBeenCalled()
  })
})
