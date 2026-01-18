/**
 * LMPagination - 分页组件
 * 用于长列表数据的分页展示
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMPagination from './LMPagination'

const meta: Meta<typeof LMPagination> = {
  title: '导航 Navigation/LMPagination 分页',
  component: LMPagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '分页组件，用于长列表数据的分页展示。支持页码跳转、每页条数切换等功能。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '组件尺寸',
    },
    simple: {
      control: 'boolean',
      description: '简洁模式',
    },
    disabled: {
      control: 'boolean',
      description: '禁用状态',
    },
    showQuickJumper: {
      control: 'boolean',
      description: '显示快速跳转',
    },
    showSizeChanger: {
      control: 'boolean',
      description: '显示每页条数选择',
    },
    showTotal: {
      control: 'boolean',
      description: '显示总数',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认分页 - 基础展示 */
export const Default: Story = {
  args: {
    current: 1,
    total: 100,
    pageSize: 10,
  },
}

/** 受控模式 - 可交互 */
export const Controlled: Story = {
  render: () => {
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <div>
        <LMPagination
          current={current}
          total={500}
          pageSize={pageSize}
          onChange={(page, size) => {
            setCurrent(page)
            setPageSize(size)
          }}
        />
        <p style={{ marginTop: '16px', color: 'var(--lm-text-secondary)' }}>
          当前第 {current} 页，每页 {pageSize} 条
        </p>
      </div>
    )
  },
}

/** 显示总数 - 展示数据总量 */
export const WithTotal: Story = {
  args: {
    current: 1,
    total: 256,
    pageSize: 10,
    showTotal: true,
  },
}

/** 自定义总数显示 - 自定义格式 */
export const CustomTotal: Story = {
  render: () => {
    const [current, setCurrent] = useState(1)

    return (
      <LMPagination
        current={current}
        total={256}
        pageSize={10}
        showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
        onChange={(page) => setCurrent(page)}
      />
    )
  },
}

/** 快速跳转 - 输入页码跳转 */
export const WithQuickJumper: Story = {
  render: () => {
    const [current, setCurrent] = useState(1)

    return (
      <LMPagination
        current={current}
        total={500}
        pageSize={10}
        showQuickJumper
        onChange={(page) => setCurrent(page)}
      />
    )
  },
}

/** 切换每页条数 - 可选择每页显示数量 */
export const WithSizeChanger: Story = {
  render: () => {
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <LMPagination
        current={current}
        total={500}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={[10, 20, 50, 100]}
        onChange={(page, size) => {
          setCurrent(page)
          setPageSize(size)
        }}
      />
    )
  },
}

/** 完整功能 - 所有功能组合 */
export const FullFeatured: Story = {
  render: () => {
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <LMPagination
        current={current}
        total={1000}
        pageSize={pageSize}
        showTotal={(total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条数据`}
        showSizeChanger
        showQuickJumper
        onChange={(page, size) => {
          setCurrent(page)
          setPageSize(size)
        }}
      />
    )
  },
}

/** 简洁模式 - 仅显示上下页 */
export const Simple: Story = {
  render: () => {
    const [current, setCurrent] = useState(1)

    return (
      <LMPagination
        current={current}
        total={100}
        pageSize={10}
        simple
        onChange={(page) => setCurrent(page)}
      />
    )
  },
}

/** 禁用状态 - 不可交互 */
export const Disabled: Story = {
  args: {
    current: 5,
    total: 200,
    pageSize: 10,
    disabled: true,
  },
}

/** 少量页数 - 不显示省略号 */
export const FewPages: Story = {
  args: {
    current: 1,
    total: 50,
    pageSize: 10,
  },
}

/** 大量页数 - 显示省略号 */
export const ManyPages: Story = {
  render: () => {
    const [current, setCurrent] = useState(50)

    return (
      <LMPagination
        current={current}
        total={10000}
        pageSize={10}
        onChange={(page) => setCurrent(page)}
      />
    )
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>XS 尺寸</p>
        <LMPagination current={5} total={100} size="xs" />
      </div>
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>SM 尺寸</p>
        <LMPagination current={5} total={100} size="sm" />
      </div>
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>MD 尺寸（默认）</p>
        <LMPagination current={5} total={100} size="md" />
      </div>
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>LG 尺寸</p>
        <LMPagination current={5} total={100} size="lg" />
      </div>
    </div>
  ),
}

/** 在表格底部 - 实际使用场景 */
export const InTableFooter: Story = {
  render: () => {
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    return (
      <div
        style={{
          width: '800px',
          border: '1px solid var(--lm-border-default)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Mock table */}
        <div
          style={{
            backgroundColor: 'var(--lm-bg-paper)',
            borderBottom: '1px solid var(--lm-border-default)',
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', fontWeight: 500, color: 'var(--lm-text-secondary)' }}>
            <span>ID</span>
            <span>名称</span>
            <span>状态</span>
            <span>日期</span>
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              padding: '12px 16px',
              borderBottom: i < 4 ? '1px solid var(--lm-border-light)' : 'none',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', color: 'var(--lm-text-primary)' }}>
              <span>{(current - 1) * pageSize + i + 1}</span>
              <span>项目 {(current - 1) * pageSize + i + 1}</span>
              <span style={{ color: 'var(--lm-success-500)' }}>正常</span>
              <span>2024-01-{String(i + 1).padStart(2, '0')}</span>
            </div>
          </div>
        ))}
        {/* Pagination */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--lm-border-default)',
            backgroundColor: 'var(--lm-bg-paper)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <LMPagination
            current={current}
            total={256}
            pageSize={pageSize}
            showTotal
            showSizeChanger
            size="sm"
            onChange={(page, size) => {
              setCurrent(page)
              setPageSize(size)
            }}
          />
        </div>
      </div>
    )
  },
}

/** 居中展示 - 页脚居中 */
export const Centered: Story = {
  render: () => {
    const [current, setCurrent] = useState(1)

    return (
      <div style={{ width: '600px', display: 'flex', justifyContent: 'center' }}>
        <LMPagination
          current={current}
          total={100}
          onChange={(page) => setCurrent(page)}
        />
      </div>
    )
  },
}
