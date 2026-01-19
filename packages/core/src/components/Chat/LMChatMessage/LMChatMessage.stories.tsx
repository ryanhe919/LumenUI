/**
 * LMChatMessage - 聊天消息组件
 * 完整的聊天消息，包含头像、气泡、时间戳、操作按钮等
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMChatMessage from './LMChatMessage'

const meta: Meta<typeof LMChatMessage> = {
  title: '聊天 Chat/LMChatMessage 聊天消息',
  component: LMChatMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '完整的聊天消息组件，包含头像、气泡、时间戳、操作按钮等。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: 'select',
      options: ['user', 'assistant', 'system'],
      description: '消息角色',
    },
    status: {
      control: 'select',
      options: ['sending', 'sent', 'error', 'streaming'],
      description: '消息状态',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '尺寸',
    },
    hideAvatar: {
      control: 'boolean',
      description: '隐藏头像',
    },
    showActions: {
      control: 'boolean',
      description: '显示操作按钮',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/** 用户消息 - 显示在右侧 */
export const UserMessage: Story = {
  args: {
    role: 'user',
    content: '你好，请帮我写一个 React 组件，用于显示用户头像和名称。',
    name: '用户',
    timestamp: '10:30',
  },
}

/** 助手消息 - 显示在左侧 */
export const AssistantMessage: Story = {
  args: {
    role: 'assistant',
    content: '好的，我来帮你创建一个用户信息展示组件。这个组件将接收用户头像 URL 和名称作为 props，并提供美观的展示效果。',
    name: 'AI 助手',
    timestamp: '10:31',
  },
}

/** 带自定义头像 */
export const WithAvatar: Story = {
  args: {
    role: 'assistant',
    content: '这是带自定义头像的消息',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai',
    name: 'AI 助手',
    timestamp: '10:30',
  },
}

/** 发送中状态 */
export const Sending: Story = {
  args: {
    role: 'user',
    content: '正在发送的消息...',
    status: 'sending',
    name: '用户',
  },
}

/** 流式输出中 */
export const Streaming: Story = {
  args: {
    role: 'assistant',
    content: '我正在生成回复内容，请稍候',
    status: 'streaming',
    name: 'AI 助手',
  },
}

/** 错误状态 */
export const Error: Story = {
  args: {
    role: 'user',
    content: '发送失败的消息',
    status: 'error',
    errorMessage: '网络连接失败',
    onRetry: () => console.log('重试发送'),
  },
}

/** 带操作按钮 - hover 显示 */
export const WithActions: Story = {
  args: {
    role: 'assistant',
    content: '这是一条可以复制和重新生成的消息。hover 时显示操作按钮。',
    name: 'AI 助手',
    timestamp: '10:30',
    onRetry: () => console.log('重新生成'),
  },
}

/** 隐藏头像 - 连续消息 */
export const HideAvatar: Story = {
  args: {
    role: 'user',
    content: '连续的消息（隐藏头像）',
    hideAvatar: true,
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LMChatMessage size="sm" role="assistant" content="Small 尺寸消息" />
      <LMChatMessage size="md" role="assistant" content="Medium 尺寸消息" />
      <LMChatMessage size="lg" role="assistant" content="Large 尺寸消息" />
    </div>
  ),
}

/** 完整对话示例 */
export const Conversation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LMChatMessage
        role="user"
        content="你好！我想了解一下 React Hooks。"
        name="小明"
        timestamp="10:00"
      />
      <LMChatMessage
        role="assistant"
        content="你好！React Hooks 是 React 16.8 引入的新特性，它让你在函数组件中使用 state 和其他 React 特性。最常用的 Hooks 包括 useState、useEffect、useContext 等。你想了解哪个方面？"
        name="AI 助手"
        timestamp="10:01"
      />
      <LMChatMessage
        role="user"
        content="请给我解释一下 useState 的用法"
        name="小明"
        timestamp="10:02"
      />
    </div>
  ),
}
