/**
 * LMButton - 按钮组件
 * 用于触发操作或事件的交互元素
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMButton from './LMButton'

const meta: Meta<typeof LMButton> = {
  title: '通用 General/LMButton 按钮',
  component: LMButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '按钮组件，用于触发操作。支持多种样式变体、尺寸、加载状态和图标。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning'],
      description: '按钮的样式变体',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '按钮的尺寸',
    },
    loading: {
      control: 'boolean',
      description: '是否显示加载状态',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用按钮',
    },
    fullWidth: {
      control: 'boolean',
      description: '是否撑满容器宽度',
    },
    rounded: {
      control: 'boolean',
      description: '是否使用圆角样式',
    },
    leftIcon: {
      description: '按钮左侧图标',
    },
    rightIcon: {
      description: '按钮右侧图标',
    },
    loadingText: {
      description: '加载状态时显示的文字',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 主要按钮 - 用于主要操作，蓝色填充样式 */
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
}

/** 次要按钮 - 用于次要操作，灰色填充样式 */
export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
}

/** 轮廓按钮 - 边框样式，背景透明 */
export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
}

/** 幽灵按钮 - 无边框无背景，仅有文字 */
export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
}

/** 危险按钮 - 用于删除等危险操作 */
export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
  },
}

/** 成功按钮 - 用于确认等积极操作 */
export const Success: Story = {
  args: {
    children: 'Success Button',
    variant: 'success',
  },
}

/** 警告按钮 - 用于需要注意的操作 */
export const Warning: Story = {
  args: {
    children: 'Warning Button',
    variant: 'warning',
  },
}

/** 加载状态 - 显示加载动画 */
export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'primary',
    loading: true,
  },
}

/** 加载状态带文字 - 加载时显示自定义文字 */
export const LoadingWithText: Story = {
  args: {
    children: 'Submit',
    variant: 'primary',
    loading: true,
    loadingText: 'Submitting...',
  },
}

/** 禁用状态 - 不可点击的按钮 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
}

/** 带左侧图标 - 图标在文字前 */
export const WithLeftIcon: Story = {
  args: {
    children: 'Save',
    variant: 'primary',
    leftIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
}

/** 带右侧图标 - 图标在文字后 */
export const WithRightIcon: Story = {
  args: {
    children: 'Next',
    variant: 'primary',
    rightIcon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
  },
}

/** 全宽按钮 - 占满容器宽度 */
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

/** 圆角按钮 - 使用更大的圆角 */
export const Rounded: Story = {
  args: {
    children: 'Rounded Button',
    variant: 'primary',
    rounded: true,
  },
}

/** 尺寸展示 - 从超小到超大的所有尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <LMButton size="xs">Extra Small</LMButton>
      <LMButton size="sm">Small</LMButton>
      <LMButton size="md">Medium</LMButton>
      <LMButton size="lg">Large</LMButton>
      <LMButton size="xl">Extra Large</LMButton>
      <LMButton size="2xl">2X Large</LMButton>
    </div>
  ),
}

/** 所有变体 - 展示全部样式变体 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <LMButton variant="primary">Primary</LMButton>
      <LMButton variant="secondary">Secondary</LMButton>
      <LMButton variant="outline">Outline</LMButton>
      <LMButton variant="ghost">Ghost</LMButton>
      <LMButton variant="danger">Danger</LMButton>
      <LMButton variant="success">Success</LMButton>
      <LMButton variant="warning">Warning</LMButton>
    </div>
  ),
}
