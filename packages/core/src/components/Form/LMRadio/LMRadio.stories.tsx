/**
 * LMRadio - 单选框组件
 * 用于单选场景的表单控件
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMRadio from './LMRadio'

const meta: Meta<typeof LMRadio> = {
  title: '表单 Form/LMRadio 单选框',
  component: LMRadio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '单选框组件，用于在多个选项中选择一个。支持标签、描述和多种尺寸。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '单选框尺寸',
    },
    error: {
      control: 'boolean',
      description: '是否为错误状态',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    label: {
      description: '单选框标签',
    },
    description: {
      description: '单选框描述文字',
    },
    name: {
      description: '单选框组名称',
    },
    value: {
      description: '单选框的值',
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

/** 默认单选框 - 基础的单选按钮 */
export const Default: Story = {
  args: {
    label: 'Option A',
    name: 'option',
  },
}

/** 带描述 - 显示额外说明信息 */
export const WithDescription: Story = {
  args: {
    label: 'Standard shipping',
    description: '4-10 business days',
    name: 'shipping',
  },
}

/** 选中状态 - 已选择的单选框 */
export const Checked: Story = {
  args: {
    label: 'Selected option',
    name: 'selected',
    checked: true,
  },
}

/** 错误状态 - 显示校验错误 */
export const Error: Story = {
  args: {
    label: 'Invalid option',
    name: 'error',
    error: true,
    errorMessage: 'Please select a valid option',
  },
}

/** 禁用状态 - 不可交互 */
export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    name: 'disabled',
    disabled: true,
  },
}

/** 禁用且选中 - 禁用状态下的已选中 */
export const DisabledChecked: Story = {
  args: {
    label: 'Disabled selected',
    name: 'disabled-checked',
    disabled: true,
    checked: true,
  },
}

/** 单选组 - 多个单选框互斥选择 */
export const RadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState('email')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <LMRadio
          label="Email"
          description="Get notifications via email"
          name="contact"
          value="email"
          checked={selected === 'email'}
          onChange={() => setSelected('email')}
        />
        <LMRadio
          label="SMS"
          description="Get notifications via text message"
          name="contact"
          value="sms"
          checked={selected === 'sms'}
          onChange={() => setSelected('sms')}
        />
        <LMRadio
          label="Push"
          description="Get push notifications on your device"
          name="contact"
          value="push"
          checked={selected === 'push'}
          onChange={() => setSelected('push')}
        />
      </div>
    )
  },
}

/** 配送选项 - 实际业务场景示例 */
export const ShippingOptions: Story = {
  render: () => {
    const [selected, setSelected] = useState('standard')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <LMRadio
          label="Standard shipping"
          description="4-10 business days - Free"
          name="shipping"
          value="standard"
          checked={selected === 'standard'}
          onChange={() => setSelected('standard')}
        />
        <LMRadio
          label="Express shipping"
          description="2-5 business days - $4.99"
          name="shipping"
          value="express"
          checked={selected === 'express'}
          onChange={() => setSelected('express')}
        />
        <LMRadio
          label="Next day delivery"
          description="1 business day - $14.99"
          name="shipping"
          value="nextday"
          checked={selected === 'nextday'}
          onChange={() => setSelected('nextday')}
        />
      </div>
    )
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <LMRadio size="xs" label="Extra Small" name="size-demo" />
      <LMRadio size="sm" label="Small" name="size-demo" />
      <LMRadio size="md" label="Medium" name="size-demo" />
      <LMRadio size="lg" label="Large" name="size-demo" />
      <LMRadio size="xl" label="Extra Large" name="size-demo" />
      <LMRadio size="2xl" label="2X Large" name="size-demo" />
    </div>
  ),
}
