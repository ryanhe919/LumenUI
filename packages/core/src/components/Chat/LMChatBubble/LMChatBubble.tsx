import React, { memo } from 'react'
import type { ComponentSize } from '../../../utils/componentSizes'
import { clampComponentSize, COMPONENT_SIZE_ORDER, SIZE_TEXT_CLASSES, SIZE_PADDING_CLASSES } from '../../../utils/componentSizes'

/** 聊天气泡主题样式 */
const chatBubbleThemeStyles = `
  :root, [data-theme="light"] {
    --lm-bubble-assistant-bg: rgba(255, 255, 255, 0.85);
    --lm-bubble-assistant-border: rgba(0, 0, 0, 0.06);
    --lm-bubble-assistant-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
    --lm-bubble-outline-bg: rgba(255, 255, 255, 0.9);
    --lm-bubble-outline-border: rgba(0, 0, 0, 0.1);
    --lm-bubble-soft-bg: rgba(249, 250, 251, 0.9);
    --lm-bubble-soft-border: rgba(0, 0, 0, 0.04);
    --lm-bubble-system-bg: rgba(249, 250, 251, 0.7);
    --lm-bubble-system-border: rgba(0, 0, 0, 0.1);
    --lm-bubble-error-bg: rgba(254, 226, 226, 0.9);
    --lm-bubble-error-border: rgba(239, 68, 68, 0.2);
  }
  [data-theme="dark"] {
    --lm-bubble-assistant-bg: rgba(51, 65, 85, 0.85);
    --lm-bubble-assistant-border: rgba(255, 255, 255, 0.08);
    --lm-bubble-assistant-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1);
    --lm-bubble-outline-bg: rgba(51, 65, 85, 0.6);
    --lm-bubble-outline-border: rgba(255, 255, 255, 0.12);
    --lm-bubble-soft-bg: rgba(30, 41, 59, 0.9);
    --lm-bubble-soft-border: rgba(255, 255, 255, 0.06);
    --lm-bubble-system-bg: rgba(30, 41, 59, 0.7);
    --lm-bubble-system-border: rgba(255, 255, 255, 0.1);
    --lm-bubble-error-bg: rgba(127, 29, 29, 0.5);
    --lm-bubble-error-border: rgba(239, 68, 68, 0.3);
  }
`

export type ChatRole = 'user' | 'assistant' | 'system'

export type ChatBubbleVariant = 'default' | 'filled' | 'outline' | 'soft'

export interface LMChatBubbleProps {
  /** 消息角色 */
  role?: ChatRole
  /** 气泡变体 */
  variant?: ChatBubbleVariant
  /** 尺寸 */
  size?: ComponentSize
  /** 气泡内容 */
  children: React.ReactNode
  /** 是否正在打字（流式输出中） */
  isStreaming?: boolean
  /** 自定义类名 */
  className?: string
  /** 错误状态 */
  error?: boolean
  /** 尾部装饰（如时间戳、状态图标） */
  footer?: React.ReactNode
  /** 自定义样式 */
  style?: React.CSSProperties
}

/** 气泡配置 - 更精致的圆角设计 */
const BUBBLE_CONFIG: Record<ChatRole, {
  align: 'left' | 'right'
  borderRadius: string
}> = {
  user: {
    align: 'right',
    borderRadius: '20px 4px 20px 20px',
  },
  assistant: {
    align: 'left',
    borderRadius: '4px 20px 20px 20px',
  },
  system: {
    align: 'left',
    borderRadius: '16px',
  },
}

const LMChatBubble: React.FC<LMChatBubbleProps> = ({
  role = 'user',
  variant = 'default',
  size = 'md',
  children,
  isStreaming = false,
  className = '',
  error = false,
  footer,
  style,
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const config = BUBBLE_CONFIG[role]

  // 获取气泡样式 - 更现代的 glassmorphism 效果
  const getBubbleStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      borderRadius: config.borderRadius,
      transition: 'all var(--lm-transition-normal) var(--lm-ease-out)',
      maxWidth: '85%',
      wordBreak: 'break-word',
      position: 'relative',
    }

    // 错误状态
    if (error) {
      return {
        ...baseStyles,
        backgroundColor: 'var(--lm-bubble-error-bg)',
        color: 'var(--lm-error-700)',
        border: '1px solid var(--lm-bubble-error-border)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
      }
    }

    // 用户消息样式 - 渐变蓝色
    if (role === 'user') {
      switch (variant) {
        case 'filled':
        case 'default':
          return {
            ...baseStyles,
            background: 'linear-gradient(135deg, var(--lm-primary-500) 0%, var(--lm-primary-600) 100%)',
            color: 'white',
            boxShadow: '0 2px 12px rgba(0, 122, 255, 0.25), 0 1px 3px rgba(0, 122, 255, 0.1)',
          }
        case 'outline':
          return {
            ...baseStyles,
            backgroundColor: 'var(--lm-bubble-outline-bg)',
            backdropFilter: 'blur(12px)',
            color: 'var(--lm-primary-600)',
            border: '1.5px solid var(--lm-primary-300)',
            boxShadow: '0 2px 8px rgba(0, 122, 255, 0.08)',
          }
        case 'soft':
          return {
            ...baseStyles,
            backgroundColor: 'var(--lm-bubble-soft-bg)',
            backdropFilter: 'blur(8px)',
            color: 'var(--lm-primary-700)',
            border: '1px solid rgba(0, 122, 255, 0.12)',
          }
        default:
          return {
            ...baseStyles,
            background: 'linear-gradient(135deg, var(--lm-primary-500) 0%, var(--lm-primary-600) 100%)',
            color: 'white',
            boxShadow: '0 2px 12px rgba(0, 122, 255, 0.25)',
          }
      }
    }

    // 助手消息样式 - glassmorphism 效果
    if (role === 'assistant') {
      switch (variant) {
        case 'filled':
        case 'default':
          return {
            ...baseStyles,
            backgroundColor: 'var(--lm-bubble-assistant-bg)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            color: 'var(--lm-text-primary)',
            boxShadow: 'var(--lm-bubble-assistant-shadow)',
            border: '1px solid var(--lm-bubble-assistant-border)',
          }
        case 'outline':
          return {
            ...baseStyles,
            backgroundColor: 'var(--lm-bubble-outline-bg)',
            backdropFilter: 'blur(12px)',
            color: 'var(--lm-text-primary)',
            border: '1.5px solid var(--lm-bubble-outline-border)',
          }
        case 'soft':
          return {
            ...baseStyles,
            backgroundColor: 'var(--lm-bubble-soft-bg)',
            backdropFilter: 'blur(8px)',
            color: 'var(--lm-text-primary)',
            border: '1px solid var(--lm-bubble-soft-border)',
          }
        default:
          return {
            ...baseStyles,
            backgroundColor: 'var(--lm-bubble-assistant-bg)',
            backdropFilter: 'blur(20px) saturate(180%)',
            color: 'var(--lm-text-primary)',
            boxShadow: 'var(--lm-bubble-assistant-shadow)',
            border: '1px solid var(--lm-bubble-assistant-border)',
          }
      }
    }

    // 系统消息样式 - 微妙的玻璃效果
    return {
      ...baseStyles,
      backgroundColor: 'var(--lm-bubble-system-bg)',
      backdropFilter: 'blur(8px)',
      color: 'var(--lm-text-secondary)',
      border: '1px dashed var(--lm-bubble-system-border)',
    }
  }

  return (
    <>
      <style>{chatBubbleThemeStyles}</style>
      <div
        className={`
          w-full
          ${SIZE_PADDING_CLASSES[resolvedSize]}
          ${SIZE_TEXT_CLASSES[resolvedSize]}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        style={{
          ...getBubbleStyles(),
          ...style,
        }}
      >
        {/* 内容 */}
        <div className="relative leading-relaxed">
          {children}

          {/* 流式输出光标 - 更精致的动画 */}
          {isStreaming && (
            <span
              className="inline-block w-0.5 h-[1.1em] ml-1 align-middle rounded-full"
              style={{
                backgroundColor: role === 'user' ? 'rgba(255, 255, 255, 0.8)' : 'var(--lm-primary-500)',
                animation: 'lm-cursor-blink 1s ease-in-out infinite',
              }}
            />
          )}
        </div>

        {/* 尾部装饰 */}
        {footer && (
          <div
            className="mt-2 text-xs font-medium"
            style={{
              color: role === 'user'
                ? 'rgba(255, 255, 255, 0.7)'
                : 'var(--lm-text-tertiary)'
            }}
          >
            {footer}
          </div>
        )}

        {/* 光标闪烁动画样式 */}
        <style>{`
        @keyframes lm-cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lm-cursor-blink { animation: none; opacity: 1; }
        }
      `}</style>
      </div>
    </>
  )
}

export default memo(LMChatBubble)
