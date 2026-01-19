import React, { memo, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import type { ComponentSize } from '../../../utils/componentSizes'
import { clampComponentSize, COMPONENT_SIZE_ORDER } from '../../../utils/componentSizes'
import { LMChatMessage, type LMChatMessageProps } from '../LMChatMessage'
import { LMTypingIndicator, type TypingIndicatorVariant } from '../LMTypingIndicator'

/** 滚动条主题样式 */
const scrollbarThemeStyles = `
  :root, [data-theme="light"] {
    --lm-scrollbar-track: rgba(0, 0, 0, 0.02);
    --lm-scrollbar-thumb: rgba(0, 0, 0, 0.15);
    --lm-scrollbar-thumb-hover: rgba(0, 0, 0, 0.25);
  }
  [data-theme="dark"] {
    --lm-scrollbar-track: rgba(255, 255, 255, 0.02);
    --lm-scrollbar-thumb: rgba(255, 255, 255, 0.15);
    --lm-scrollbar-thumb-hover: rgba(255, 255, 255, 0.25);
  }

  /* WebKit scrollbar styling */
  .lm-chat-list-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .lm-chat-list-scrollbar::-webkit-scrollbar-track {
    background: var(--lm-scrollbar-track);
    border-radius: 3px;
  }
  .lm-chat-list-scrollbar::-webkit-scrollbar-thumb {
    background: var(--lm-scrollbar-thumb);
    border-radius: 3px;
    transition: background 0.2s ease;
  }
  .lm-chat-list-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--lm-scrollbar-thumb-hover);
  }

  /* Firefox scrollbar styling */
  .lm-chat-list-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--lm-scrollbar-thumb) var(--lm-scrollbar-track);
  }
`

export interface ChatMessage extends Omit<LMChatMessageProps, 'size' | 'variant'> {
  /** 消息唯一 ID（必须） */
  id: string
}

export interface LMChatListProps {
  /** 消息列表 */
  messages: ChatMessage[]
  /** 尺寸 */
  size?: ComponentSize
  /** 消息气泡变体 */
  variant?: 'default' | 'filled' | 'outline' | 'soft'
  /** 是否显示打字指示器 */
  showTypingIndicator?: boolean
  /** 打字指示器变体 */
  typingIndicatorVariant?: TypingIndicatorVariant
  /** 打字指示器文字 */
  typingIndicatorText?: string
  /** 打字指示器头像 */
  typingIndicatorAvatar?: React.ReactNode
  /** 是否自动滚动到底部 */
  autoScrollToBottom?: boolean
  /** 滚动行为 */
  scrollBehavior?: 'auto' | 'smooth'
  /** 消息间距 */
  messageGap?: number
  /** 自定义类名 */
  className?: string
  /** 空状态内容 */
  emptyContent?: React.ReactNode
  /** 加载中状态 */
  loading?: boolean
  /** 加载更多回调（滚动到顶部时触发） */
  onLoadMore?: () => void
  /** 是否还有更多消息 */
  hasMore?: boolean
  /** 加载更多文字 */
  loadMoreText?: string
  /** 自定义渲染消息 */
  renderMessage?: (message: ChatMessage, index: number) => React.ReactNode
  /** 消息重试回调 */
  onMessageRetry?: (messageId: string) => void
  /** 气泡最大宽度（默认 85%） */
  bubbleMaxWidth?: string | number
}

export interface LMChatListRef {
  /** 滚动到底部 */
  scrollToBottom: (behavior?: 'auto' | 'smooth') => void
  /** 滚动到指定消息 */
  scrollToMessage: (messageId: string, behavior?: 'auto' | 'smooth') => void
  /** 获取容器元素 */
  getContainer: () => HTMLDivElement | null
}

/** 加载骨架屏 */
const LoadingSkeleton: React.FC = () => (
  <div className="flex flex-col gap-4 p-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
        <div
          className="w-8 h-8 rounded-full shrink-0"
          style={{ backgroundColor: 'var(--lm-bg-hover)' }}
        />
        <div
          className="h-16 rounded-2xl flex-1 max-w-[70%]"
          style={{ backgroundColor: 'var(--lm-bg-hover)' }}
        />
      </div>
    ))}
  </div>
)

/** 空状态 */
const EmptyState: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div
    className="flex flex-col items-center justify-center h-full p-8 text-center"
    style={{ color: 'var(--lm-text-tertiary)' }}
  >
    {children || (
      <>
        <svg
          className="w-16 h-16 mb-4 opacity-40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
        </svg>
        <p className="text-sm">暂无消息</p>
        <p className="text-xs mt-1 opacity-60">开始一段新的对话吧</p>
      </>
    )}
  </div>
)

/** 加载更多组件 */
const LoadMoreTrigger: React.FC<{
  loading?: boolean
  hasMore?: boolean
  text?: string
  onLoadMore?: () => void
}> = ({ loading, hasMore, text = '加载更多', onLoadMore }) => {
  if (!hasMore) return null

  return (
    <div className="flex justify-center py-3">
      <button
        onClick={onLoadMore}
        disabled={loading}
        className="px-4 py-2 text-sm rounded-lg cursor-pointer hover:opacity-80 disabled:opacity-50"
        style={{
          backgroundColor: 'var(--lm-bg-paper)',
          color: 'var(--lm-text-secondary)',
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 rounded-full animate-spin border-current border-t-transparent" />
            加载中...
          </span>
        ) : (
          text
        )}
      </button>
    </div>
  )
}

const LMChatList = forwardRef<LMChatListRef, LMChatListProps>(({
  messages,
  size = 'md',
  variant = 'default',
  showTypingIndicator = false,
  typingIndicatorVariant = 'dots',
  typingIndicatorText,
  typingIndicatorAvatar,
  autoScrollToBottom = true,
  scrollBehavior = 'smooth',
  messageGap = 16,
  className = '',
  emptyContent,
  loading = false,
  onLoadMore,
  hasMore = false,
  loadMoreText,
  renderMessage,
  onMessageRetry,
  bubbleMaxWidth,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    scrollToBottom: (behavior: 'auto' | 'smooth' = scrollBehavior) => {
      bottomRef.current?.scrollIntoView({ behavior })
    },
    scrollToMessage: (messageId: string, behavior: 'auto' | 'smooth' = scrollBehavior) => {
      const element = containerRef.current?.querySelector(`[id="${messageId}"]`)
      element?.scrollIntoView({ behavior, block: 'center' })
    },
    getContainer: () => containerRef.current,
  }), [scrollBehavior])

  // 自动滚动到底部
  useEffect(() => {
    if (autoScrollToBottom && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: scrollBehavior })
    }
  }, [messages.length, autoScrollToBottom, scrollBehavior])

  // 显示打字指示器时也滚动到底部
  useEffect(() => {
    if (showTypingIndicator && autoScrollToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: scrollBehavior })
    }
  }, [showTypingIndicator, autoScrollToBottom, scrollBehavior])

  // 检测滚动到顶部
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!onLoadMore || !hasMore) return

    const { scrollTop } = e.currentTarget
    if (scrollTop < 50) {
      onLoadMore()
    }
  }, [onLoadMore, hasMore])

  // 加载中
  if (loading && messages.length === 0) {
    return (
      <>
        <style>{scrollbarThemeStyles}</style>
        <div
          ref={containerRef}
          className={`flex-1 overflow-y-auto lm-chat-list-scrollbar ${className}`.trim()}
        >
          <LoadingSkeleton />
        </div>
      </>
    )
  }

  // 空状态
  if (messages.length === 0 && !showTypingIndicator) {
    return (
      <>
        <style>{scrollbarThemeStyles}</style>
        <div
          ref={containerRef}
          className={`flex-1 overflow-y-auto lm-chat-list-scrollbar ${className}`.trim()}
        >
          <EmptyState>{emptyContent}</EmptyState>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{scrollbarThemeStyles}</style>
      <div
        ref={containerRef}
        className={`flex-1 overflow-y-auto lm-chat-list-scrollbar ${className}`.trim()}
        onScroll={handleScroll}
      >
      {/* 加载更多 */}
      <LoadMoreTrigger
        loading={loading}
        hasMore={hasMore}
        text={loadMoreText}
        onLoadMore={onLoadMore}
      />

      {/* 消息列表 */}
      <div
        className="flex flex-col p-4"
        style={{ gap: `${messageGap}px` }}
      >
        {messages.map((message, index) => (
          renderMessage ? (
            <React.Fragment key={message.id}>
              {renderMessage(message, index)}
            </React.Fragment>
          ) : (
            <LMChatMessage
              key={message.id}
              {...message}
              size={resolvedSize}
              variant={variant}
              onRetry={onMessageRetry ? () => onMessageRetry(message.id) : undefined}
              bubbleMaxWidth={bubbleMaxWidth}
            />
          )
        ))}

        {/* 打字指示器 */}
        {showTypingIndicator && (
          <LMTypingIndicator
            variant={typingIndicatorVariant}
            size={resolvedSize}
            text={typingIndicatorText}
            avatar={typingIndicatorAvatar}
          />
        )}

        {/* 滚动锚点 */}
        <div ref={bottomRef} />
      </div>
    </div>
    </>
  )
})

LMChatList.displayName = 'LMChatList'

export default memo(LMChatList)
