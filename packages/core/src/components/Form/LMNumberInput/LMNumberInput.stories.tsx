/**
 * LMNumberInput - 数字输入框组件
 * 用于数值输入，支持步进、范围限制和精度控制
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMNumberInput from './LMNumberInput'

const meta: Meta<typeof LMNumberInput> = {
  title: '表单 Form/LMNumberInput 数字输入框',
  component: LMNumberInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '数字输入框组件，支持数值递增/递减、范围限制、精度控制和前后缀。',
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
    showControls: {
      control: 'boolean',
      description: '是否显示增减按钮',
    },
    min: {
      description: '最小值',
    },
    max: {
      description: '最大值',
    },
    step: {
      description: '步进值',
    },
    precision: {
      description: '小数精度',
    },
    prefix: {
      description: '前缀字符',
    },
    suffix: {
      description: '后缀字符',
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

/** 默认数字输入 - 基础的数字输入框 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(0)
    return <LMNumberInput value={value} onChange={setValue} />
  },
}

/** 带范围限制 - 设置最小和最大值 */
export const WithMinMax: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(5)
    return <LMNumberInput value={value} onChange={setValue} min={0} max={10} />
  },
}

/** 自定义步进 - 每次递增/递减5 */
export const WithStep: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(0)
    return <LMNumberInput value={value} onChange={setValue} step={5} />
  },
}

/** 小数精度 - 支持两位小数 */
export const WithPrecision: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(0)
    return <LMNumberInput value={value} onChange={setValue} step={0.1} precision={2} />
  },
}

/** 带前缀 - 货币符号 */
export const WithPrefix: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(100)
    return <LMNumberInput value={value} onChange={setValue} prefix="$" />
  },
}

/** 带后缀 - 百分比符号 */
export const WithSuffix: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(50)
    return <LMNumberInput value={value} onChange={setValue} suffix="%" />
  },
}

/** 无控制按钮 - 隐藏增减按钮 */
export const WithoutControls: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(0)
    return <LMNumberInput value={value} onChange={setValue} showControls={false} />
  },
}

/** 错误状态 - 显示校验错误 */
export const Error: Story = {
  args: {
    value: -5,
    error: true,
    errorMessage: 'Value must be positive',
    min: 0,
  },
}

/** 禁用状态 - 不可编辑 */
export const Disabled: Story = {
  args: {
    value: 42,
    disabled: true,
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <LMNumberInput size="xs" placeholder="Extra Small" />
      <LMNumberInput size="sm" placeholder="Small" />
      <LMNumberInput size="md" placeholder="Medium" />
      <LMNumberInput size="lg" placeholder="Large" />
      <LMNumberInput size="xl" placeholder="Extra Large" />
      <LMNumberInput size="2xl" placeholder="2X Large" />
    </div>
  ),
}

/** 价格输入 - 货币金额场景 */
export const PriceInput: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(99.99)
    return (
      <LMNumberInput
        value={value}
        onChange={setValue}
        prefix="$"
        precision={2}
        min={0}
        step={0.01}
      />
    )
  },
}

/** 数量选择器 - 商品数量场景 */
export const QuantitySelector: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(1)
    return (
      <LMNumberInput
        value={value}
        onChange={setValue}
        min={1}
        max={99}
        step={1}
      />
    )
  },
}

/** 百分比输入 - 百分比数值场景 */
export const PercentageInput: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(50)
    return (
      <LMNumberInput
        value={value}
        onChange={setValue}
        suffix="%"
        min={0}
        max={100}
        step={1}
      />
    )
  },
}
