/**
 * LMBadge - 徽章组件
 * 用于展示状态、标签、计数等信息的小型标记元素
 */
import type { Meta, StoryObj } from '@storybook/react'
import LMBadge from './LMBadge'

const meta: Meta<typeof LMBadge> = {
  title: '通用 General/LMBadge 徽章',
  component: LMBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '徽章组件，用于展示状态标记、标签、计数器等。支持多种颜色变体、尺寸和状态指示点。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'],
      description: '徽章的颜色变体',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: '徽章的尺寸',
    },
    dot: {
      control: 'boolean',
      description: '是否显示状态指示点',
    },
    icon: {
      description: '徽章前的图标元素',
    },
    children: {
      description: '徽章的文本内容',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 主要样式 - 蓝色背景，用于强调重要信息 */
export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
}

/** 次要样式 - 灰色背景，用于一般性标签 */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

/** 成功样式 - 绿色背景，用于表示成功状态 */
export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
}

/** 警告样式 - 黄色背景，用于提示注意事项 */
export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
}

/** 错误样式 - 红色背景，用于表示错误或危险 */
export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error',
  },
}

/** 信息样式 - 浅蓝色背景，用于展示一般信息 */
export const Info: Story = {
  args: {
    children: 'Info',
    variant: 'info',
  },
}

/** 中性样式 - 中性色背景，用于低调展示 */
export const Neutral: Story = {
  args: {
    children: 'Neutral',
    variant: 'neutral',
  },
}

/** 带状态点 - 显示一个小圆点表示在线等状态 */
export const WithDot: Story = {
  args: {
    children: 'Active',
    variant: 'success',
    dot: true,
  },
}

/** 带图标 - 在文字前显示一个图标 */
export const WithIcon: Story = {
  args: {
    children: 'New',
    variant: 'primary',
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
    ),
  },
}

/** 尺寸展示 - 从超小到大号的所有尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <LMBadge size="xs">Extra Small</LMBadge>
      <LMBadge size="sm">Small</LMBadge>
      <LMBadge size="md">Medium</LMBadge>
      <LMBadge size="lg">Large</LMBadge>
    </div>
  ),
}

/** 所有变体 - 展示全部颜色样式 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <LMBadge variant="primary">Primary</LMBadge>
      <LMBadge variant="secondary">Secondary</LMBadge>
      <LMBadge variant="success">Success</LMBadge>
      <LMBadge variant="warning">Warning</LMBadge>
      <LMBadge variant="error">Error</LMBadge>
      <LMBadge variant="info">Info</LMBadge>
      <LMBadge variant="neutral">Neutral</LMBadge>
    </div>
  ),
}

/** 状态点变体 - 不同颜色搭配状态指示点 */
export const WithDotVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <LMBadge variant="primary" dot>Active</LMBadge>
      <LMBadge variant="success" dot>Online</LMBadge>
      <LMBadge variant="warning" dot>Away</LMBadge>
      <LMBadge variant="error" dot>Busy</LMBadge>
    </div>
  ),
}
