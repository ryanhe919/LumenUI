/**
 * LMTable - 表格组件
 * 用于展示结构化数据，支持排序、分页、选择等功能
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMTable from './LMTable'
import LMBadge from '../../General/LMBadge/LMBadge'
import LMButton from '../../General/LMButton/LMButton'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
}

const sampleData: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', createdAt: '2024-02-20' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', status: 'inactive', createdAt: '2024-03-10' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'pending', createdAt: '2024-04-05' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Admin', status: 'active', createdAt: '2024-05-01' },
]

const columns = [
  { title: 'Name', dataIndex: 'name', sorter: true },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Role', dataIndex: 'role' },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (value: unknown) => {
      const status = value as User['status']
      const variant = status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'warning'
      return <LMBadge variant={variant} size="sm">{status}</LMBadge>
    },
  },
  { title: 'Created', dataIndex: 'createdAt' },
]

const meta: Meta<typeof LMTable> = {
  title: '数据展示 Data Display/LMTable 表格',
  component: LMTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '表格组件，用于展示和操作结构化数据。支持排序、筛选、分页、行选择等功能。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '表格尺寸',
    },
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outline', 'minimal', 'soft', 'zebra'],
      description: '表格样式变体',
    },
    bordered: {
      description: '是否显示边框',
    },
    striped: {
      description: '是否显示斑马纹',
    },
    selectable: {
      description: '是否支持行选择',
    },
    loading: {
      description: '是否显示加载状态',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认表格 - 基础的数据展示 */
export const Default: Story = {
  args: {
    dataSource: sampleData,
    columns,
    rowKey: 'id',
  },
}

/** 加载状态 - 数据加载中 */
export const Loading: Story = {
  args: {
    dataSource: [],
    columns,
    loading: true,
  },
}

/** 空状态 - 无数据时显示 */
export const Empty: Story = {
  args: {
    dataSource: [],
    columns,
    emptyText: 'No users found',
  },
}

/** 带边框 - 显示单元格边框 */
export const Bordered: Story = {
  args: {
    dataSource: sampleData,
    columns,
    bordered: true,
  },
}

/** 斑马纹 - 交替行背景色 */
export const Striped: Story = {
  args: {
    dataSource: sampleData,
    columns,
    striped: true,
  },
}

/** 可选择 - 支持行选择 */
export const Selectable: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])

    return (
      <div>
        <p style={{ marginBottom: '16px' }}>Selected: {selectedKeys.join(', ') || 'None'}</p>
        <LMTable
          dataSource={sampleData}
          columns={columns}
          selectable
          selectedRowKeys={selectedKeys}
          onSelectionChange={(keys) => setSelectedKeys(keys)}
        />
      </div>
    )
  },
}

/** 带排序 - 支持列排序 */
export const WithSorting: Story = {
  render: () => {
    const [sortInfo, setSortInfo] = useState<{ field: string; order: 'ascend' | 'descend' } | null>(null)

    return (
      <div>
        <p style={{ marginBottom: '16px' }}>
          Sort: {sortInfo ? `${sortInfo.field} (${sortInfo.order})` : 'None'}
        </p>
        <LMTable
          dataSource={sampleData}
          columns={columns}
          onSortChange={(field, order) => setSortInfo({ field, order })}
        />
      </div>
    )
  },
}

/** 带分页 - 支持数据分页 */
export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(2)

    const paginatedData = sampleData.slice((page - 1) * pageSize, page * pageSize)

    return (
      <LMTable
        dataSource={paginatedData}
        columns={columns}
        pagination={{
          current: page,
          pageSize,
          total: sampleData.length,
          showPagination: true,
          showTotal: true,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: [2, 5, 10],
          onChange: (newPage, newPageSize) => {
            setPage(newPage)
            setPageSize(newPageSize)
          },
        }}
      />
    )
  },
}

/** 加载更多 - 滚动加载 */
export const WithLoadMore: Story = {
  render: () => {
    const [data, setData] = useState(sampleData.slice(0, 2))
    const [loading, setLoading] = useState(false)

    const handleLoadMore = () => {
      setLoading(true)
      setTimeout(() => {
        setData((prev) => [...prev, ...sampleData.slice(prev.length, prev.length + 2)])
        setLoading(false)
      }, 1000)
    }

    return (
      <LMTable
        dataSource={data}
        columns={columns}
        loadMore={{
          enabled: true,
          hasMore: data.length < sampleData.length,
          loading,
          onLoadMore: handleLoadMore,
        }}
      />
    )
  },
}

/** 行点击 - 支持点击行事件 */
export const WithRowClick: Story = {
  render: () => {
    const [selected, setSelected] = useState<User | null>(null)

    return (
      <div>
        <p style={{ marginBottom: '16px' }}>
          Clicked: {selected ? selected.name : 'None'}
        </p>
        <LMTable
          dataSource={sampleData}
          columns={columns}
          onRowClick={(record) => setSelected(record as User)}
        />
      </div>
    )
  },
}

/** 带操作列 - 每行显示操作按钮 */
export const WithActions: Story = {
  args: {
    dataSource: sampleData,
    columns: [
      ...columns,
      {
        title: 'Actions',
        dataIndex: 'id',
        render: () => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <LMButton size="xs" variant="outline">Edit</LMButton>
            <LMButton size="xs" variant="danger">Delete</LMButton>
          </div>
        ),
      },
    ],
  },
}

/** 样式变体 - 所有表格样式 */
export const Variants: Story = {
  render: () => {
    const variants: Array<'default' | 'elevated' | 'outline' | 'minimal' | 'soft' | 'zebra'> = [
      'default',
      'elevated',
      'outline',
      'minimal',
      'soft',
      'zebra',
    ]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {variants.map((variant) => (
          <div key={variant}>
            <h3 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>{variant}</h3>
            <LMTable
              dataSource={sampleData.slice(0, 3)}
              columns={columns.slice(0, 3)}
              variant={variant}
            />
          </div>
        ))}
      </div>
    )
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => {
    const sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg']

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {sizes.map((size) => (
          <div key={size}>
            <h3 style={{ marginBottom: '12px', textTransform: 'uppercase' }}>{size}</h3>
            <LMTable
              dataSource={sampleData.slice(0, 3)}
              columns={columns.slice(0, 3)}
              size={size}
            />
          </div>
        ))}
      </div>
    )
  },
}

/** 自定义渲染 - 自定义单元格内容 */
export const CustomRender: Story = {
  args: {
    dataSource: sampleData,
    columns: [
      {
        title: 'User',
        dataIndex: 'name',
        render: (value: unknown, record: unknown) => {
          const user = record as User
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {(value as string).charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{value as string}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
              </div>
            </div>
          )
        },
      },
      { title: 'Role', dataIndex: 'role' },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (value: unknown) => {
          const status = value as User['status']
          const variant = status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'warning'
          return <LMBadge variant={variant}>{status}</LMBadge>
        },
      },
    ],
  },
}
