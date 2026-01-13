/**
 * LMCheckbox - 复选框组件
 * 用于多选场景的表单控件
 */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import LMCheckbox from './LMCheckbox'

const meta: Meta<typeof LMCheckbox> = {
  title: '表单 Form/LMCheckbox 复选框',
  component: LMCheckbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '复选框组件，用于多选场景。支持标签、描述、错误状态和多种尺寸。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '复选框的尺寸',
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
      description: '复选框的标签文字',
    },
    description: {
      description: '复选框的描述文字',
    },
    errorMessage: {
      description: '错误提示信息',
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

/** 默认状态 - 基础的复选框 */
export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
}

/** 带描述 - 显示额外的说明文字 */
export const WithDescription: Story = {
  args: {
    label: 'Email notifications',
    description: 'Receive emails about your account activity and security.',
  },
}

/** 选中状态 - 已勾选的复选框 */
export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return (
      <LMCheckbox
        label="I agree to the privacy policy"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    )
  },
}

/** 错误状态 - 显示错误提示 */
export const Error: Story = {
  args: {
    label: 'Accept terms and conditions',
    error: true,
    errorMessage: 'You must accept the terms to continue',
  },
}

/** 禁用状态 - 不可交互 */
export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
}

/** 禁用且选中 - 禁用状态下的已选中 */
export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked',
    disabled: true,
    checked: true,
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <LMCheckbox size="xs" label="Extra Small" />
      <LMCheckbox size="sm" label="Small" />
      <LMCheckbox size="md" label="Medium" />
      <LMCheckbox size="lg" label="Large" />
      <LMCheckbox size="xl" label="Extra Large" />
      <LMCheckbox size="2xl" label="2X Large" />
    </div>
  ),
}

/** 复选框组 - 多个复选框的组合使用 */
export const CheckboxGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['email'])
    const toggle = (value: string) => {
      setSelected((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      )
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <LMCheckbox
          label="Email notifications"
          description="Get notified via email"
          checked={selected.includes('email')}
          onChange={() => toggle('email')}
        />
        <LMCheckbox
          label="SMS notifications"
          description="Get notified via SMS"
          checked={selected.includes('sms')}
          onChange={() => toggle('sms')}
        />
        <LMCheckbox
          label="Push notifications"
          description="Get notified via push"
          checked={selected.includes('push')}
          onChange={() => toggle('push')}
        />
      </div>
    )
  },
}
