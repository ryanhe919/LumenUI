/**
 * LMChatContainer - 聊天容器组件
 * 完整的聊天界面，整合消息列表和输入框
 */
import React, { useState, useEffect, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMChatContainer from './LMChatContainer'
import type { ChatMessage } from '../LMChatList'
import { LMMarkdownRenderer } from '../LMMarkdownRenderer'
import { ToolbarButton } from '../LMChatInput'

const meta: Meta<typeof LMChatContainer> = {
  title: '聊天 Chat/LMChatContainer 聊天容器',
  component: LMChatContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '完整的聊天容器组件，整合了消息列表和输入框，提供开箱即用的聊天界面。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '尺寸',
    },
    disabled: {
      control: 'boolean',
      description: '禁用输入',
    },
    isGenerating: {
      control: 'boolean',
      description: '正在生成',
    },
    showTypingIndicator: {
      control: 'boolean',
      description: '显示打字指示器',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: '你好！请帮我写一个 React 组件。',
    name: '用户',
    timestamp: '10:00',
  },
  {
    id: '2',
    role: 'assistant',
    content: '你好！我很乐意帮助你。请告诉我你需要什么样的组件？需要什么功能？',
    name: 'AI 助手',
    timestamp: '10:01',
  },
  {
    id: '3',
    role: 'user',
    content: '我需要一个用户卡片组件，显示头像、名称和简介。',
    name: '用户',
    timestamp: '10:02',
  },
]

/** 基础聊天容器 */
export const Default: Story = {
  args: {
    messages: sampleMessages,
    placeholder: '输入消息...',
    height: '100%',
    onSend: (content) => console.log('发送:', content),
  },
}

/** 空状态 */
export const Empty: Story = {
  args: {
    messages: [],
    placeholder: '开始对话...',
    height: '100%',
  },
}

/** 正在生成 */
export const Generating: Story = {
  args: {
    messages: sampleMessages,
    isGenerating: true,
    showTypingIndicator: true,
    typingIndicatorText: 'AI 正在思考...',
    height: '100%',
    onStop: () => console.log('停止生成'),
  },
}

/** 禁用输入 */
export const Disabled: Story = {
  args: {
    messages: sampleMessages,
    disabled: true,
    placeholder: '输入已禁用',
    height: '100%',
  },
}

/** 带头部 */
export const WithHeader: Story = {
  args: {
    messages: sampleMessages,
    height: '100%',
    header: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--lm-primary-500) 0%, var(--lm-primary-700) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}>
          AI
        </div>
        <div>
          <div style={{ fontWeight: '600', color: 'var(--lm-text-primary)' }}>AI 助手</div>
          <div style={{ fontSize: '12px', color: 'var(--lm-text-tertiary)' }}>在线</div>
        </div>
      </div>
    ),
  },
}

/** 带底部额外内容 */
export const WithFooter: Story = {
  args: {
    messages: sampleMessages,
    height: '100%',
    footer: (
      <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--lm-text-tertiary)' }}>
        <span>建议话题：</span>
        <button style={{
          padding: '2px 8px',
          borderRadius: '4px',
          border: '1px solid var(--lm-border-default)',
          background: 'var(--lm-bg-elevated)',
          color: 'var(--lm-text-secondary)',
          cursor: 'pointer',
        }}>
          React Hooks
        </button>
        <button style={{
          padding: '2px 8px',
          borderRadius: '4px',
          border: '1px solid var(--lm-border-default)',
          background: 'var(--lm-bg-elevated)',
          color: 'var(--lm-text-secondary)',
          cursor: 'pointer',
        }}>
          TypeScript
        </button>
        <button style={{
          padding: '2px 8px',
          borderRadius: '4px',
          border: '1px solid var(--lm-border-default)',
          background: 'var(--lm-bg-elevated)',
          color: 'var(--lm-text-secondary)',
          cursor: 'pointer',
        }}>
          状态管理
        </button>
      </div>
    ),
  },
}

/** Markdown 代码示例 */
const codeExample = `好的，这是一个用户卡片组件的实现：

\`\`\`tsx
interface UserCardProps {
  avatar: string;
  name: string;
  bio: string;
}

function UserCard({ avatar, name, bio }: UserCardProps) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>{bio}</p>
    </div>
  );
}
\`\`\`

你还需要添加样式吗？`

/** 完整功能演示 */
export const FullFeature: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: '4',
        role: 'assistant',
        content: <LMMarkdownRenderer content={codeExample} />,
        name: 'AI 助手',
        timestamp: '10:03',
      },
    ],
    height: '100%',
    header: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--lm-primary-500) 0%, var(--lm-primary-700) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
          }}>
            AI
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--lm-text-primary)' }}>AI 编程助手</div>
            <div style={{ fontSize: '12px', color: 'var(--lm-text-tertiary)' }}>随时为您服务</div>
          </div>
        </div>
        <button style={{
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid var(--lm-border-default)',
          background: 'var(--lm-bg-elevated)',
          color: 'var(--lm-text-primary)',
          cursor: 'pointer',
          fontSize: '12px',
        }}>
          新对话
        </button>
      </div>
    ),
    inputToolbar: (
      <>
        <ToolbarButton
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          }
          label="附件"
          onClick={() => console.log('附件')}
        />
        <ToolbarButton
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          }
          label="图片"
          onClick={() => console.log('图片')}
        />
        <ToolbarButton
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          }
          label="文档"
          onClick={() => console.log('文档')}
        />
      </>
    ),
    onSend: (content) => console.log('发送:', content),
  },
}

/** 打字机效果 Markdown 内容 */
const streamingMarkdownContent = `好的，我来帮你实现一个 **用户卡片组件**！

## 功能特点

这个组件包含以下功能：

1. 显示用户 **头像**
2. 显示用户 *名称*
3. 显示用户简介
4. 支持 \`hover\` 效果

## 代码实现

\`\`\`tsx
import React from 'react';
import './UserCard.css';

interface UserCardProps {
  avatar: string;
  name: string;
  bio: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  avatar,
  name,
  bio
}) => {
  return (
    <div className="user-card">
      <img
        src={avatar}
        alt={name}
        className="user-avatar"
      />
      <h3 className="user-name">{name}</h3>
      <p className="user-bio">{bio}</p>
    </div>
  );
};
\`\`\`

## 样式文件

\`\`\`css
.user-card {
  padding: 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}
\`\`\`

> 💡 **提示**: 你可以根据需要调整样式变量来适配你的设计系统。

需要我帮你添加更多功能吗？比如：
- 添加社交媒体链接
- 添加关注/取消关注按钮
- 添加在线状态指示器`

/** 打字机流式输出演示组件 */
const TypewriterStreamingDemo: React.FC = () => {
  const [displayText, setDisplayText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [charIndex, setCharIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  const startStreaming = useCallback(() => {
    setDisplayText('')
    setCharIndex(0)
    setIsStreaming(true)
    setHasStarted(true)
  }, [])

  const stopStreaming = useCallback(() => {
    setIsStreaming(false)
  }, [])

  useEffect(() => {
    if (!isStreaming) return

    if (charIndex < streamingMarkdownContent.length) {
      const timer = setTimeout(() => {
        // 每次增加 1-3 个字符，模拟更自然的打字效果
        const increment = Math.floor(Math.random() * 3) + 1
        const nextIndex = Math.min(charIndex + increment, streamingMarkdownContent.length)
        setDisplayText(streamingMarkdownContent.slice(0, nextIndex))
        setCharIndex(nextIndex)
      }, 20)
      return () => clearTimeout(timer)
    } else {
      setIsStreaming(false)
    }
  }, [charIndex, isStreaming])

  const messages: ChatMessage[] = [
    {
      id: '1',
      role: 'user',
      content: '请帮我写一个 React 用户卡片组件，包含头像、名称和简介。',
      name: '用户',
      timestamp: '10:00',
    },
  ]

  // 如果已开始流式输出，添加助手消息
  if (hasStarted) {
    messages.push({
      id: '2',
      role: 'assistant',
      content: <LMMarkdownRenderer content={displayText} />,
      name: 'AI 助手',
      timestamp: '10:01',
      status: isStreaming ? 'streaming' : 'sent',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
      <LMChatContainer
        messages={messages}
        height="calc(100% - 50px)"
        isGenerating={isStreaming}
        onStop={stopStreaming}
        placeholder="输入消息..."
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--lm-primary-500) 0%, var(--lm-primary-700) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
            }}>
              AI
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--lm-text-primary)' }}>
                AI 编程助手
              </div>
              <div style={{ fontSize: '12px', color: 'var(--lm-text-tertiary)' }}>
                {isStreaming ? '正在输入...' : '在线'}
              </div>
            </div>
          </div>
        }
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={startStreaming}
          disabled={isStreaming}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid var(--lm-border-default)',
            background: isStreaming ? 'var(--lm-bg-disabled)' : 'var(--lm-primary-500)',
            color: isStreaming ? 'var(--lm-text-disabled)' : 'white',
            cursor: isStreaming ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {hasStarted ? '重新播放' : '开始演示'}
        </button>
        {isStreaming && (
          <button
            onClick={stopStreaming}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--lm-error-500)',
              background: 'var(--lm-error-500)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            停止
          </button>
        )}
      </div>
    </div>
  )
}

/** 打字机效果 - 流式输出 Markdown */
export const TypewriterStreaming: Story = {
  render: () => <TypewriterStreamingDemo />,
  decorators: [
    (Story) => (
      <div style={{ width: '700px', height: '600px' }}>
        <Story />
      </div>
    ),
  ],
}
