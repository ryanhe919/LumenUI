/**
 * LMSelect - 下拉选择框组件
 * 用于从预设选项中进行单选或多选
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMSelect from './LMSelect'

const meta: Meta<typeof LMSelect> = {
  title: '表单 Form/LMSelect 选择器',
  component: LMSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '下拉选择框组件，支持单选和多选模式。可配置禁用选项、占位符和错误状态。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '选择框尺寸',
    },
    error: {
      control: 'boolean',
      description: '是否为错误状态',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    multiple: {
      control: 'boolean',
      description: '是否支持多选',
    },
    options: {
      description: '选项列表',
    },
    placeholder: {
      description: '占位提示文字',
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

const defaultOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
]

/** 默认选择框 - 基础的单选下拉 */
export const Default: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Select a framework...',
  },
}

/** 带默认值 - 显示已选择项 */
export const WithValue: Story = {
  args: {
    options: defaultOptions,
    value: 'react',
  },
}

/** 带禁用选项 - 部分选项不可选 */
export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'angular', label: 'Angular (Coming Soon)', disabled: true },
      { value: 'svelte', label: 'Svelte' },
    ],
    placeholder: 'Select a framework...',
  },
}

/** 错误状态 - 显示校验错误 */
export const Error: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Select a framework...',
    error: true,
    errorMessage: 'Please select a framework',
  },
}

/** 禁用状态 - 整体不可交互 */
export const Disabled: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Select a framework...',
    disabled: true,
  },
}

/** 多选模式 - 可选择多个选项 */
export const Multiple: Story = {
  render: () => {
    const [values, setValues] = useState<(string | number)[]>([])
    return (
      <LMSelect
        options={defaultOptions}
        value={values}
        onChange={(v) => setValues(v as (string | number)[])}
        placeholder="Select frameworks..."
        multiple
      />
    )
  },
}

/** 多选带默认值 - 预选多个选项 */
export const MultipleWithInitialValues: Story = {
  render: () => {
    const [values, setValues] = useState<(string | number)[]>(['react', 'vue'])
    return (
      <LMSelect
        options={defaultOptions}
        value={values}
        onChange={(v) => setValues(v as (string | number)[])}
        placeholder="Select frameworks..."
        multiple
      />
    )
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <LMSelect size="xs" options={defaultOptions} placeholder="Extra Small" />
      <LMSelect size="sm" options={defaultOptions} placeholder="Small" />
      <LMSelect size="md" options={defaultOptions} placeholder="Medium" />
      <LMSelect size="lg" options={defaultOptions} placeholder="Large" />
      <LMSelect size="xl" options={defaultOptions} placeholder="Extra Large" />
      <LMSelect size="2xl" options={defaultOptions} placeholder="2X Large" />
    </div>
  ),
}

/** 大量选项 - 带滚动的长列表 */
export const ManyOptions: Story = {
  args: {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'date', label: 'Date' },
      { value: 'elderberry', label: 'Elderberry' },
      { value: 'fig', label: 'Fig' },
      { value: 'grape', label: 'Grape' },
      { value: 'honeydew', label: 'Honeydew' },
      { value: 'kiwi', label: 'Kiwi' },
      { value: 'lemon', label: 'Lemon' },
      { value: 'mango', label: 'Mango' },
      { value: 'nectarine', label: 'Nectarine' },
    ],
    placeholder: 'Select a fruit...',
  },
}

/** 受控模式 - 显示当前选中值 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | number>('')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <LMSelect
          options={defaultOptions}
          value={value}
          onChange={(v) => setValue(v as string | number)}
          placeholder="Select a framework..."
        />
        <p style={{ fontSize: '14px', color: 'var(--lm-text-secondary)' }}>
          Selected: {value || 'None'}
        </p>
      </div>
    )
  },
}
