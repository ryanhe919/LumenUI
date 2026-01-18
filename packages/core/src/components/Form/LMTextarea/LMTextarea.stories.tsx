/**
 * LMTextarea - 文本域组件
 * 用于多行文本输入的表单控件
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMTextarea from './LMTextarea'

const meta: Meta<typeof LMTextarea> = {
  title: '表单 Form/LMTextarea 文本域',
  component: LMTextarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '文本域组件，用于多行文本输入。支持自动高度、字数限制和错误状态。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '文本域尺寸',
    },
    error: {
      control: 'boolean',
      description: '是否为错误状态',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    rows: {
      description: '显示的行数',
    },
    maxLength: {
      description: '最大字符数',
    },
    placeholder: {
      description: '占位提示文字',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认文本域 - 基础的多行输入 */
export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
}

/** 带默认值 - 显示预设内容 */
export const WithValue: Story = {
  args: {
    value: 'This is some example text in the textarea.',
    onChange: () => {},
  },
}

/** 错误状态 - 显示校验错误 */
export const Error: Story = {
  args: {
    placeholder: 'Enter description...',
    error: true,
    errorMessage: 'Description is required',
  },
}

/** 禁用状态 - 不可编辑 */
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
  },
}

/** 自定义行数 - 显示更多行 */
export const WithRows: Story = {
  args: {
    placeholder: 'Enter a longer message...',
    rows: 6,
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LMTextarea size="xs" placeholder="Extra Small" />
      <LMTextarea size="sm" placeholder="Small" />
      <LMTextarea size="md" placeholder="Medium" />
      <LMTextarea size="lg" placeholder="Large" />
      <LMTextarea size="xl" placeholder="Extra Large" />
      <LMTextarea size="2xl" placeholder="2X Large" />
    </div>
  ),
}

/** 评论输入框 - 评论场景 */
export const CommentBox: Story = {
  args: {
    placeholder: 'Write a comment...',
    rows: 4,
  },
}

/** 个人简介 - 带字数限制 */
export const BioField: Story = {
  args: {
    placeholder: 'Tell us about yourself...',
    maxLength: 500,
  },
}
