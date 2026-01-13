/**
 * LMInput - 输入框组件
 * 用于文本、密码、邮箱等类型的单行输入
 */
import type { Meta, StoryObj } from '@storybook/react'
import LMInput from './LMInput'

const meta: Meta<typeof LMInput> = {
  title: '表单 Form/LMInput 输入框',
  component: LMInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '输入框组件，支持多种输入类型、图标、错误状态和尺寸。适用于表单数据录入场景。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '输入框尺寸',
    },
    error: {
      control: 'boolean',
      description: '是否为错误状态',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local'],
      description: '输入类型',
    },
    placeholder: {
      description: '占位提示文字',
    },
    leftIcon: {
      description: '左侧图标',
    },
    rightElement: {
      description: '右侧元素',
    },
    errorMessage: {
      description: '错误提示信息',
    },
    includeSeconds: {
      description: '时间输入是否包含秒',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认输入框 - 基础文本输入 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

/** 带默认值 - 显示预设内容 */
export const WithValue: Story = {
  args: {
    value: 'Hello World',
    onChange: () => {},
  },
}

/** 带左侧图标 - 搜索样式 */
export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
}

/** 带右侧元素 - 密码可见切换 */
export const WithRightElement: Story = {
  args: {
    placeholder: 'Enter password',
    type: 'password',
    rightElement: (
      <button type="button" style={{ color: 'var(--lm-text-secondary)' }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    ),
  },
}

/** 错误状态 - 显示校验错误 */
export const Error: Story = {
  args: {
    placeholder: 'Enter email',
    value: 'invalid-email',
    error: true,
    errorMessage: 'Please enter a valid email address',
    onChange: () => {},
  },
}

/** 禁用状态 - 不可编辑 */
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

/** 邮箱输入框 - 带邮件图标 */
export const EmailInput: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
    leftIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
}

/** 日期输入框 - 日期选择器 */
export const DateInput: Story = {
  args: {
    type: 'date',
  },
}

/** 时间输入框 - 时间选择器 */
export const TimeInput: Story = {
  args: {
    type: 'time',
  },
}

/** 时间带秒 - 包含秒的时间输入 */
export const TimeWithSeconds: Story = {
  args: {
    type: 'time',
    includeSeconds: true,
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <LMInput size="xs" placeholder="Extra Small" />
      <LMInput size="sm" placeholder="Small" />
      <LMInput size="md" placeholder="Medium" />
      <LMInput size="lg" placeholder="Large" />
      <LMInput size="xl" placeholder="Extra Large" />
      <LMInput size="2xl" placeholder="2X Large" />
    </div>
  ),
}
