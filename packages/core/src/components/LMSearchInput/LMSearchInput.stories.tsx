/**
 * LMSearchInput - 搜索输入框组件
 * 专用于搜索场景的输入框，带有搜索图标和清除按钮
 */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import LMSearchInput from './LMSearchInput'

const meta: Meta<typeof LMSearchInput> = {
  title: '表单 Form/LMSearchInput 搜索框',
  component: LMSearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '搜索输入框组件，专为搜索场景设计。支持搜索按钮、清除按钮和回车搜索。',
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
    showClear: {
      control: 'boolean',
      description: '是否显示清除按钮',
    },
    showSearchButton: {
      control: 'boolean',
      description: '是否显示搜索按钮',
    },
    placeholder: {
      description: '占位提示文字',
    },
    searchButtonText: {
      description: '搜索按钮文字',
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

/** 默认搜索框 - 带搜索按钮和清除功能 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <LMSearchInput
        value={value}
        onChange={setValue}
        onSearch={(v) => console.log('Search:', v)}
      />
    )
  },
}

/** 带默认值 - 显示已输入内容 */
export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('React components')
    return (
      <LMSearchInput
        value={value}
        onChange={setValue}
        onSearch={(v) => console.log('Search:', v)}
      />
    )
  },
}

/** 无搜索按钮 - 只有输入框 */
export const WithoutSearchButton: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <LMSearchInput
        value={value}
        onChange={setValue}
        showSearchButton={false}
        onSearch={(v) => console.log('Search:', v)}
      />
    )
  },
}

/** 无清除按钮 - 不显示清除功能 */
export const WithoutClearButton: Story = {
  render: () => {
    const [value, setValue] = useState('Some text')
    return (
      <LMSearchInput
        value={value}
        onChange={setValue}
        showClear={false}
        onSearch={(v) => console.log('Search:', v)}
      />
    )
  },
}

/** 自定义按钮文字 - 修改搜索按钮文本 */
export const CustomButtonText: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <LMSearchInput
        value={value}
        onChange={setValue}
        searchButtonText="Find"
        onSearch={(v) => console.log('Search:', v)}
      />
    )
  },
}

/** 自定义占位符 - 修改提示文字 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Search products...',
  },
}

/** 错误状态 - 显示校验错误 */
export const Error: Story = {
  args: {
    error: true,
    errorMessage: 'Search term is too short',
  },
}

/** 禁用状态 - 不可交互 */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled search',
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <LMSearchInput size="xs" placeholder="Extra Small" />
      <LMSearchInput size="sm" placeholder="Small" />
      <LMSearchInput size="md" placeholder="Medium" />
      <LMSearchInput size="lg" placeholder="Large" />
      <LMSearchInput size="xl" placeholder="Extra Large" />
      <LMSearchInput size="2xl" placeholder="2X Large" />
    </div>
  ),
}

/** 极简搜索框 - 无按钮无清除 */
export const MinimalSearch: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <LMSearchInput
        value={value}
        onChange={setValue}
        showSearchButton={false}
        showClear={false}
        placeholder="Type to search..."
        onSearch={(v) => console.log('Search:', v)}
      />
    )
  },
}
