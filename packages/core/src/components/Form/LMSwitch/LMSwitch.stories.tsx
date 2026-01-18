/**
 * LMSwitch - 开关组件
 * 用于切换两种状态的表单控件
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMSwitch from './LMSwitch'

const meta: Meta<typeof LMSwitch> = {
  title: '表单 Form/LMSwitch 开关',
  component: LMSwitch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '开关组件，用于在两种状态之间切换。支持标签、描述和多种尺寸。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '开关尺寸',
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
      description: '开关标签',
    },
    description: {
      description: '开关描述文字',
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

/** 默认开关 - 基础的开关控件 */
export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <LMSwitch
        label="Airplane mode"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    )
  },
}

/** 带描述 - 显示额外说明信息 */
export const WithDescription: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <LMSwitch
        label="Dark mode"
        description="Enable dark mode for better night viewing"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    )
  },
}

/** 选中状态 - 已开启的开关 */
export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return (
      <LMSwitch
        label="Notifications enabled"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    )
  },
}

/** 错误状态 - 显示校验错误 */
export const Error: Story = {
  args: {
    label: 'Enable feature',
    error: true,
    errorMessage: 'This feature requires a premium subscription',
  },
}

/** 禁用状态 - 不可交互 */
export const Disabled: Story = {
  args: {
    label: 'Disabled switch',
    disabled: true,
  },
}

/** 禁用且选中 - 禁用状态下的已开启 */
export const DisabledChecked: Story = {
  args: {
    label: 'Disabled enabled',
    disabled: true,
    checked: true,
  },
}

/** 无标签 - 仅显示开关本身 */
export const WithoutLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <LMSwitch
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        aria-label="Toggle"
      />
    )
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => {
    const SwitchWithState = ({ size, label }: { size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'; label: string }) => {
      const [checked, setChecked] = useState(false)
      return (
        <LMSwitch
          size={size}
          label={label}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      )
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SwitchWithState size="xs" label="Extra Small" />
        <SwitchWithState size="sm" label="Small" />
        <SwitchWithState size="md" label="Medium" />
        <SwitchWithState size="lg" label="Large" />
        <SwitchWithState size="xl" label="Extra Large" />
        <SwitchWithState size="2xl" label="2X Large" />
      </div>
    )
  },
}

/** 设置面板 - 实际业务场景示例 */
export const SettingsPanel: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      autoUpdate: true,
    })
    const toggle = (key: keyof typeof settings) => {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <LMSwitch
          label="Push notifications"
          description="Receive push notifications on your device"
          checked={settings.notifications}
          onChange={() => toggle('notifications')}
        />
        <LMSwitch
          label="Dark mode"
          description="Use dark theme across the app"
          checked={settings.darkMode}
          onChange={() => toggle('darkMode')}
        />
        <LMSwitch
          label="Auto update"
          description="Automatically download and install updates"
          checked={settings.autoUpdate}
          onChange={() => toggle('autoUpdate')}
        />
      </div>
    )
  },
}
