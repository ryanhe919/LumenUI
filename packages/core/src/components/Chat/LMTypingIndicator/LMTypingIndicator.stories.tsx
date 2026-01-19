/**
 * LMTypingIndicator - 打字指示器组件
 * 用于显示 AI 正在输入的动画效果，支持多种动画变体
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMTypingIndicator from './LMTypingIndicator'

const meta: Meta<typeof LMTypingIndicator> = {
  title: '聊天 Chat/LMTypingIndicator 打字指示器',
  component: LMTypingIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '打字指示器组件，用于显示 AI 正在输入的动画效果。支持多种动画变体。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['dots', 'pulse', 'wave', 'bounce'],
      description: '动画变体',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '尺寸',
    },
    text: {
      control: 'text',
      description: '显示文字',
    },
    color: {
      control: 'color',
      description: '点的颜色',
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

/** 默认样式 - 点动画 */
export const Default: Story = {
  args: {
    variant: 'dots',
  },
}

/** 带文字提示 */
export const WithText: Story = {
  args: {
    variant: 'dots',
    text: '正在输入...',
  },
}

/** 脉冲动画 */
export const Pulse: Story = {
  args: {
    variant: 'pulse',
    text: '处理中...',
  },
}

/** 波浪动画 */
export const Wave: Story = {
  args: {
    variant: 'wave',
    text: '生成中...',
  },
}

/** 弹跳动画 */
export const Bounce: Story = {
  args: {
    variant: 'bounce',
    text: '思考中...',
  },
}

/** 自定义颜色 */
export const CustomColor: Story = {
  args: {
    variant: 'dots',
    text: '蓝色主题',
    color: '#007AFF',
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="xs"</div>
        <LMTypingIndicator size="xs" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="sm"</div>
        <LMTypingIndicator size="sm" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="md"</div>
        <LMTypingIndicator size="md" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="lg"</div>
        <LMTypingIndicator size="lg" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="xl"</div>
        <LMTypingIndicator size="xl" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="2xl"</div>
        <LMTypingIndicator size="2xl" />
      </div>
    </div>
  ),
}

/** 所有变体展示 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>variant="dots"</div>
        <LMTypingIndicator variant="dots" text="dots 动画" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>variant="pulse"</div>
        <LMTypingIndicator variant="pulse" text="pulse 动画" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>variant="wave"</div>
        <LMTypingIndicator variant="wave" text="wave 动画" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>variant="bounce"</div>
        <LMTypingIndicator variant="bounce" text="bounce 动画" />
      </div>
    </div>
  ),
}

/** 带头像 */
export const WithAvatar: Story = {
  args: {
    variant: 'dots',
    text: 'AI 正在思考...',
    avatar: (
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px',
      }}>
        AI
      </div>
    ),
  },
}
