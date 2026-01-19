/**
 * LMChatBubble - 聊天气泡组件
 * 支持用户/助手/系统三种角色，可自定义气泡内容
 */
import React, { useState, useEffect, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMChatBubble from './LMChatBubble'

const meta: Meta<typeof LMChatBubble> = {
  title: '聊天 Chat/LMChatBubble 聊天气泡',
  component: LMChatBubble,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '聊天气泡组件，支持用户/助手/系统三种角色，可自定义气泡内容。',
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
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outline', 'soft'],
      description: '气泡变体',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '尺寸',
    },
    isStreaming: {
      control: 'boolean',
      description: '流式输出中',
    },
    error: {
      control: 'boolean',
      description: '错误状态',
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

/** 用户消息 - 默认蓝色主题 */
export const UserMessage: Story = {
  args: {
    role: 'user',
    children: '你好，请帮我写一个 React 组件。',
  },
}

/** 助手消息 - 默认白色主题 */
export const AssistantMessage: Story = {
  args: {
    role: 'assistant',
    children: '好的，我来帮你创建一个 React 组件。首先，请告诉我你需要什么样的功能？',
  },
}

/** 系统消息 - 虚线边框 */
export const SystemMessage: Story = {
  args: {
    role: 'system',
    children: '对话已开始，AI 助手将为您提供帮助。',
  },
}

/** 所有角色对比 */
export const AllRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LMChatBubble role="user">
        这是用户发送的消息
      </LMChatBubble>
      <LMChatBubble role="assistant">
        这是 AI 助手的回复消息
      </LMChatBubble>
      <LMChatBubble role="system">
        这是系统提示消息
      </LMChatBubble>
    </div>
  ),
}

/** 流式输出中 - 显示闪烁光标 */
export const Streaming: Story = {
  args: {
    role: 'assistant',
    isStreaming: true,
    children: '正在生成回复中',
  },
}

/** 错误状态 */
export const Error: Story = {
  args: {
    role: 'assistant',
    error: true,
    children: '消息发送失败，请重试。',
  },
}

/** 带尾部装饰 */
export const WithFooter: Story = {
  args: {
    role: 'assistant',
    children: '这是一条消息内容',
    footer: '10:30 AM · 已读',
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <LMChatBubble size="xs" role="assistant">Extra Small 尺寸</LMChatBubble>
      <LMChatBubble size="sm" role="assistant">Small 尺寸</LMChatBubble>
      <LMChatBubble size="md" role="assistant">Medium 尺寸</LMChatBubble>
      <LMChatBubble size="lg" role="assistant">Large 尺寸</LMChatBubble>
      <LMChatBubble size="xl" role="assistant">Extra Large 尺寸</LMChatBubble>
      <LMChatBubble size="2xl" role="assistant">2X Large 尺寸</LMChatBubble>
    </div>
  ),
}

/** 打字机效果演示组件 */
const TypewriterDemo: React.FC = () => {
  const fullText = '你好！我是 AI 助手，很高兴为你服务。我可以帮助你解答问题、编写代码、翻译文本等。请问有什么可以帮到你的吗？'
  const [displayText, setDisplayText] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)
  const [charIndex, setCharIndex] = useState(0)

  const resetAnimation = useCallback(() => {
    setDisplayText('')
    setCharIndex(0)
    setIsStreaming(true)
  }, [])

  useEffect(() => {
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 50) // 每个字符 50ms
      return () => clearTimeout(timer)
    } else {
      setIsStreaming(false)
    }
  }, [charIndex, fullText])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LMChatBubble role="user">
        你好，请介绍一下你自己。
      </LMChatBubble>
      <LMChatBubble role="assistant" isStreaming={isStreaming}>
        {displayText}
      </LMChatBubble>
      <button
        onClick={resetAnimation}
        style={{
          alignSelf: 'flex-start',
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid var(--lm-border-default)',
          background: 'var(--lm-bg-elevated)',
          color: 'var(--lm-text-primary)',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        重新播放
      </button>
    </div>
  )
}

/** 打字机效果 - 模拟流式输出 */
export const TypewriterEffect: Story = {
  render: () => <TypewriterDemo />,
}
