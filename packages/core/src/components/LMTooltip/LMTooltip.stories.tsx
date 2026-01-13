/**
 * LMTooltip - 文字提示组件
 * 用于在鼠标悬停时显示额外信息
 */
import type { Meta, StoryObj } from '@storybook/react'
import LMTooltip from './LMTooltip'
import LMButton from '../LMButton/LMButton'

const meta: Meta<typeof LMTooltip> = {
  title: '数据展示 Data Display/LMTooltip 文字提示',
  component: LMTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '文字提示组件，鼠标悬停时显示说明信息。支持多个方向和自定义宽度。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '提示框位置',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '提示框尺寸',
    },
    content: {
      description: '提示内容',
    },
    maxWidth: {
      description: '最大宽度',
    },
    children: {
      description: '触发元素',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认提示 - 基础的文字提示 */
export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <LMButton>Hover me</LMButton>,
  },
}

/** 顶部显示 - 提示框在上方 */
export const Top: Story = {
  args: {
    content: 'Tooltip on top',
    placement: 'top',
    children: <LMButton>Top</LMButton>,
  },
}

/** 底部显示 - 提示框在下方 */
export const Bottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    placement: 'bottom',
    children: <LMButton>Bottom</LMButton>,
  },
}

/** 左侧显示 - 提示框在左边 */
export const Left: Story = {
  args: {
    content: 'Tooltip on left',
    placement: 'left',
    children: <LMButton>Left</LMButton>,
  },
}

/** 右侧显示 - 提示框在右边 */
export const Right: Story = {
  args: {
    content: 'Tooltip on right',
    placement: 'right',
    children: <LMButton>Right</LMButton>,
  },
}

/** 长内容 - 多行文字提示 */
export const LongContent: Story = {
  args: {
    content: 'This is a longer tooltip message that explains something in more detail.',
    children: <LMButton>Hover for details</LMButton>,
    maxWidth: 300,
  },
}

/** 自定义宽度 - 限制提示框宽度 */
export const WithCustomMaxWidth: Story = {
  args: {
    content: 'Custom width tooltip',
    maxWidth: 150,
    children: <LMButton>Custom width</LMButton>,
  },
}

/** 文字触发 - 在文字上触发提示 */
export const OnText: Story = {
  args: {
    content: 'Additional information',
    children: <span style={{ textDecoration: 'underline', cursor: 'help' }}>Hover this text</span>,
  },
}

/** 图标触发 - 在图标上触发提示 */
export const OnIcon: Story = {
  args: {
    content: 'Click to get help',
    children: (
      <span style={{ cursor: 'help' }}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
    ),
  },
}

/** 所有方向 - 四个方向的提示框 */
export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', padding: '60px' }}>
      <LMTooltip content="Top tooltip" placement="top">
        <LMButton>Top</LMButton>
      </LMTooltip>
      <div style={{ display: 'flex', gap: '100px' }}>
        <LMTooltip content="Left tooltip" placement="left">
          <LMButton>Left</LMButton>
        </LMTooltip>
        <LMTooltip content="Right tooltip" placement="right">
          <LMButton>Right</LMButton>
        </LMTooltip>
      </div>
      <LMTooltip content="Bottom tooltip" placement="bottom">
        <LMButton>Bottom</LMButton>
      </LMTooltip>
    </div>
  ),
}
