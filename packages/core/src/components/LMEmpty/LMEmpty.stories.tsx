/**
 * LMEmpty - 空状态组件
 * 数据为空时的占位展示
 */
import type { Meta, StoryObj } from '@storybook/react'
import LMEmpty from './LMEmpty'
import { LMButton } from '../LMButton'

/** 搜索图标 */
const SearchIcon = () => (
  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke="var(--lm-text-tertiary)" strokeWidth={2}>
    <circle cx="28" cy="28" r="16" />
    <path strokeLinecap="round" d="M40 40L52 52" />
  </svg>
)

/** 云图标 */
const CloudIcon = () => (
  <svg className="w-20 h-20" viewBox="0 0 80 80" fill="none">
    <path
      d="M60 45C60 35.611 52.389 28 43 28C35.477 28 29.163 33.015 27.273 40H25C17.82 40 12 45.82 12 53C12 60.18 17.82 66 25 66H60C66.627 66 72 60.627 72 54C72 47.373 66.627 42 60 42"
      fill="var(--lm-bg-paper)"
      stroke="var(--lm-border-default)"
      strokeWidth="2"
    />
  </svg>
)

const meta: Meta<typeof LMEmpty> = {
  title: '反馈 Feedback/LMEmpty 空状态',
  component: LMEmpty,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '空状态组件，用于在数据为空时展示占位信息。支持自定义图片、描述文字和操作按钮。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    image: {
      control: 'select',
      options: ['default', 'simple'],
      description: '预设图片类型',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '组件尺寸',
    },
    description: {
      control: 'text',
      description: '描述文字',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认样式 - 基础空状态 */
export const Default: Story = {
  args: {},
}

/** 简洁图片 - 更简单的图标 */
export const SimpleImage: Story = {
  args: {
    image: 'simple',
    description: '没有找到相关数据',
  },
}

/** 自定义描述 - 自定义提示文字 */
export const CustomDescription: Story = {
  args: {
    description: '暂无搜索结果，请尝试其他关键词',
  },
}

/** 带操作按钮 - 可交互的空状态 */
export const WithAction: Story = {
  args: {
    description: '还没有任何项目',
    children: (
      <LMButton variant="primary" size="sm">
        创建项目
      </LMButton>
    ),
  },
}

/** 多个操作 - 多按钮操作 */
export const WithMultipleActions: Story = {
  args: {
    description: '您还没有添加任何内容',
    children: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <LMButton variant="primary" size="sm">新建</LMButton>
        <LMButton variant="outline" size="sm">导入</LMButton>
      </div>
    ),
  },
}

/** 自定义图片 - 使用自定义SVG */
export const CustomImage: Story = {
  args: {
    image: <SearchIcon />,
    description: '搜索结果为空',
    children: (
      <LMButton variant="outline" size="sm">
        清空筛选条件
      </LMButton>
    ),
  },
}

/** 云存储空状态 - 场景示例 */
export const CloudStorage: Story = {
  args: {
    image: <CloudIcon />,
    description: '云存储为空，开始上传您的第一个文件',
    children: (
      <LMButton variant="primary" size="sm">
        上传文件
      </LMButton>
    ),
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>XS</p>
        <div style={{ border: '1px dashed var(--lm-border-default)', borderRadius: '8px', width: '150px' }}>
          <LMEmpty size="xs" description="暂无数据" />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>SM</p>
        <div style={{ border: '1px dashed var(--lm-border-default)', borderRadius: '8px', width: '180px' }}>
          <LMEmpty size="sm" description="暂无数据" />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>MD</p>
        <div style={{ border: '1px dashed var(--lm-border-default)', borderRadius: '8px', width: '220px' }}>
          <LMEmpty size="md" description="暂无数据" />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>LG</p>
        <div style={{ border: '1px dashed var(--lm-border-default)', borderRadius: '8px', width: '260px' }}>
          <LMEmpty size="lg" description="暂无数据" />
        </div>
      </div>
    </div>
  ),
}

/** 无图片 - 仅文字 */
export const NoImage: Story = {
  args: {
    image: null,
    description: '暂无数据',
  },
}

/** 仅图片 - 无描述 */
export const ImageOnly: Story = {
  args: {
    description: null,
  },
}

/** 表格空状态 - 在表格中使用 */
export const InTable: Story = {
  render: () => (
    <div
      style={{
        width: '600px',
        border: '1px solid var(--lm-border-default)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Table header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          backgroundColor: 'var(--lm-bg-paper)',
          borderBottom: '1px solid var(--lm-border-default)',
          padding: '12px 16px',
        }}
      >
        <span style={{ color: 'var(--lm-text-secondary)', fontWeight: 500 }}>名称</span>
        <span style={{ color: 'var(--lm-text-secondary)', fontWeight: 500 }}>类型</span>
        <span style={{ color: 'var(--lm-text-secondary)', fontWeight: 500 }}>日期</span>
        <span style={{ color: 'var(--lm-text-secondary)', fontWeight: 500 }}>操作</span>
      </div>
      {/* Empty state */}
      <LMEmpty
        size="sm"
        description="没有找到相关记录"
        image="simple"
      >
        <LMButton size="xs" variant="outline">刷新</LMButton>
      </LMEmpty>
    </div>
  ),
}

/** 卡片空状态 - 在卡片中使用 */
export const InCard: Story = {
  render: () => (
    <div
      style={{
        width: '400px',
        backgroundColor: 'var(--lm-bg-elevated)',
        border: '1px solid var(--lm-border-default)',
        borderRadius: '16px',
        padding: '16px',
      }}
    >
      <h3 style={{ color: 'var(--lm-text-primary)', marginBottom: '16px' }}>最近活动</h3>
      <LMEmpty
        size="sm"
        description="暂无最近活动"
      />
    </div>
  ),
}
