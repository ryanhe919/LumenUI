import React, { memo, useState, useCallback } from 'react'
import type { ComponentSize } from '../../../utils/componentSizes'
import { clampComponentSize, COMPONENT_SIZE_ORDER, SIZE_TEXT_CLASSES } from '../../../utils/componentSizes'
import { LMChatBubble, type ChatRole, type ChatBubbleVariant } from '../LMChatBubble'

export type MessageStatus = 'sending' | 'sent' | 'error' | 'streaming'

export interface ChatMessageAction {
  /** 操作唯一标识 */
  key: string
  /** 图标 */
  icon: React.ReactNode
  /** 提示文字 */
  tooltip?: string
  /** 点击回调 */
  onClick?: () => void
  /** 是否禁用 */
  disabled?: boolean
}

export interface LMChatMessageProps {
  /** 消息唯一 ID */
  id?: string
  /** 消息角色 */
  role?: ChatRole
  /** 消息内容（纯文本或自定义 React 节点） */
  content: React.ReactNode
  /** 头像（URL 或 React 节点） */
  avatar?: string | React.ReactNode
  /** 发送者名称 */
  name?: string
  /** 时间戳 */
  timestamp?: string | Date
  /** 消息状态 */
  status?: MessageStatus
  /** 尺寸 */
  size?: ComponentSize
  /** 气泡变体 */
  variant?: ChatBubbleVariant
  /** 操作按钮 */
  actions?: ChatMessageAction[]
  /** 是否显示操作按钮（hover 时显示） */
  showActions?: boolean
  /** 错误信息 */
  errorMessage?: string
  /** 重试回调 */
  onRetry?: () => void
  /** 自定义类名 */
  className?: string
  /** 是否隐藏头像 */
  hideAvatar?: boolean
  /** 自定义气泡渲染 */
  renderBubble?: (content: React.ReactNode) => React.ReactNode
  /** 气泡最大宽度（默认 85%） */
  bubbleMaxWidth?: string | number
}

/** 复制图标 */
const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)

/** 重新生成图标 */
const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0115-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 01-15 6.7L3 16" />
  </svg>
)

/** 对勾图标 */
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

/** 错误图标 */
const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

/** 加载图标 */
const LoadingDots: React.FC<{ className?: string }> = ({ className }) => (
  <span className={`inline-flex items-center gap-1 ${className}`}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full animate-bounce"
        style={{
          backgroundColor: 'currentColor',
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
  </span>
)

/** 头像尺寸配置 */
const AVATAR_SIZE: Record<ComponentSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
  '2xl': 'w-14 h-14',
}

/** 操作按钮尺寸配置 */
const ACTION_BUTTON_SIZE: Record<ComponentSize, string> = {
  xs: 'w-5 h-5',
  sm: 'w-6 h-6',
  md: 'w-7 h-7',
  lg: 'w-8 h-8',
  xl: 'w-9 h-9',
  '2xl': 'w-10 h-10',
}

const LMChatMessage: React.FC<LMChatMessageProps> = ({
  id,
  role = 'user',
  content,
  avatar,
  name,
  timestamp,
  status,
  size = 'md',
  variant = 'default',
  actions,
  showActions = true,
  errorMessage,
  onRetry,
  className = '',
  hideAvatar = false,
  renderBubble,
  bubbleMaxWidth = '95%',
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [copiedAction, setCopiedAction] = useState<string | null>(null)

  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const isUser = role === 'user'
  const isStreaming = status === 'streaming'
  const isError = status === 'error'

  // 格式化时间
  const formatTimestamp = useCallback((ts: string | Date): string => {
    if (typeof ts === 'string') return ts
    const date = new Date(ts)
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [])

  // 复制内容
  const handleCopy = useCallback(async (actionKey: string) => {
    try {
      const text = typeof content === 'string' ? content : ''
      await navigator.clipboard.writeText(text)
      setCopiedAction(actionKey)
      setTimeout(() => setCopiedAction(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [content])

  // 默认操作按钮
  const defaultActions: ChatMessageAction[] = role === 'assistant' ? [
    {
      key: 'copy',
      icon: copiedAction === 'copy' ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />,
      tooltip: copiedAction === 'copy' ? '已复制' : '复制',
      onClick: () => handleCopy('copy'),
    },
    ...(onRetry ? [{
      key: 'retry',
      icon: <RefreshIcon className="w-4 h-4" />,
      tooltip: '重新生成',
      onClick: onRetry,
    }] : []),
  ] : []

  const finalActions = actions || defaultActions

  // 渲染头像
  const renderAvatar = () => {
    if (hideAvatar) return null

    const avatarClasses = `
      ${AVATAR_SIZE[resolvedSize]}
      rounded-full overflow-hidden shrink-0
      flex items-center justify-center
    `.trim().replace(/\s+/g, ' ')

    if (typeof avatar === 'string') {
      return (
        <img
          src={avatar}
          alt={name || role}
          className={avatarClasses}
          style={{ objectFit: 'cover' }}
        />
      )
    }

    if (avatar) {
      return <div className={avatarClasses}>{avatar}</div>
    }

    // 默认头像
    const defaultAvatarStyle: React.CSSProperties = {
      backgroundColor: isUser ? 'var(--lm-primary-100)' : 'var(--lm-gray-100)',
      color: isUser ? 'var(--lm-primary-600)' : 'var(--lm-gray-600)',
    }

    return (
      <div className={avatarClasses} style={defaultAvatarStyle}>
        <span className={SIZE_TEXT_CLASSES[resolvedSize]}>
          {isUser ? 'U' : 'AI'}
        </span>
      </div>
    )
  }

  // 渲染操作按钮
  const renderActions = () => {
    if (!showActions || finalActions.length === 0) return null

    return (
      <div
        className={`
          flex items-center gap-1 mt-1
          transition-opacity duration-150
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `.trim().replace(/\s+/g, ' ')}
      >
        {finalActions.map((action) => (
          <button
            key={action.key}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`
              ${ACTION_BUTTON_SIZE[resolvedSize]}
              flex items-center justify-center
              rounded-lg cursor-pointer
              hover:bg-[var(--lm-bg-hover)]
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150
            `.trim().replace(/\s+/g, ' ')}
            style={{ color: 'var(--lm-text-tertiary)' }}
            title={action.tooltip}
            aria-label={action.tooltip}
          >
            {action.icon}
          </button>
        ))}
      </div>
    )
  }

  // 渲染状态指示器
  const renderStatus = () => {
    if (!status || status === 'sent') return null

    if (status === 'sending') {
      return (
        <div className="flex items-center gap-1 mt-1" style={{ color: 'var(--lm-text-tertiary)' }}>
          <LoadingDots className="text-xs" />
          <span className="text-xs">发送中</span>
        </div>
      )
    }

    if (status === 'error') {
      return (
        <div className="flex items-center gap-2 mt-2">
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--lm-error-500)' }}
          >
            <ErrorIcon className="w-3.5 h-3.5" />
            <span>{errorMessage || '发送失败'}</span>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs px-2 py-0.5 rounded-md cursor-pointer hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: 'var(--lm-error-50)',
                color: 'var(--lm-error-600)',
              }}
            >
              重试
            </button>
          )}
        </div>
      )
    }

    return null
  }

  // 气泡内容
  const bubbleContent = (
    <LMChatBubble
      role={role}
      variant={variant}
      size={resolvedSize}
      isStreaming={isStreaming}
      error={isError}
    >
      {content}
    </LMChatBubble>
  )

  return (
    <div
      id={id}
      className={`
        flex gap-3
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 头像 */}
      {renderAvatar()}

      {/* 消息主体 */}
      <div
        className={`
          flex flex-col min-w-0
          ${isUser ? 'items-end' : 'items-start'}
        `.trim().replace(/\s+/g, ' ')}
        style={{
          maxWidth: typeof bubbleMaxWidth === 'number' ? `${bubbleMaxWidth}px` : bubbleMaxWidth,
          width: typeof bubbleMaxWidth === 'number' ? `${bubbleMaxWidth}px` : bubbleMaxWidth,
        }}
      >
        {/* 名称和时间 */}
        {(name || timestamp) && (
          <div
            className={`
              flex items-center gap-2 mb-1
              ${isUser ? 'flex-row-reverse' : 'flex-row'}
            `.trim().replace(/\s+/g, ' ')}
          >
            {name && (
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--lm-text-secondary)' }}
              >
                {name}
              </span>
            )}
            {timestamp && (
              <span
                className="text-xs"
                style={{ color: 'var(--lm-text-tertiary)' }}
              >
                {formatTimestamp(timestamp)}
              </span>
            )}
          </div>
        )}

        {/* 气泡 */}
        {renderBubble ? renderBubble(bubbleContent) : bubbleContent}

        {/* 状态指示器 */}
        {renderStatus()}

        {/* 操作按钮 */}
        {!isError && renderActions()}
      </div>
    </div>
  )
}

export default memo(LMChatMessage)
