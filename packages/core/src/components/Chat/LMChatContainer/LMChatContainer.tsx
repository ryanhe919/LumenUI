import React, { memo, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import type { ComponentSize } from '../../../utils/componentSizes'
import { clampComponentSize, COMPONENT_SIZE_ORDER } from '../../../utils/componentSizes'
import { LMChatList, type LMChatListRef, type ChatMessage, type LMChatListProps } from '../LMChatList'
import { LMChatInput } from '../LMChatInput'

export interface LMChatContainerProps {
  /** 消息列表 */
  messages: ChatMessage[]
  /** 尺寸 */
  size?: ComponentSize
  /** 消息气泡变体 */
  variant?: 'default' | 'filled' | 'outline' | 'soft'
  /** 发送消息回调 */
  onSend?: (content: string) => void
  /** 停止生成回调 */
  onStop?: () => void
  /** 是否正在生成 */
  isGenerating?: boolean
  /** 是否禁用输入 */
  disabled?: boolean
  /** 输入框占位符 */
  placeholder?: string
  /** 输入框值（受控） */
  inputValue?: string
  /** 输入框值变化回调 */
  onInputChange?: (value: string) => void
  /** 最大输入字符数 */
  maxInputLength?: number
  /** 显示字符计数 */
  showInputCount?: boolean
  /** 是否显示打字指示器 */
  showTypingIndicator?: boolean
  /** 打字指示器文字 */
  typingIndicatorText?: string
  /** 打字指示器头像 */
  typingIndicatorAvatar?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 头部内容 */
  header?: React.ReactNode
  /** 底部额外内容（输入框上方） */
  footer?: React.ReactNode
  /** 输入框右侧插槽 */
  inputRightSlot?: React.ReactNode
  /** 输入框底部工具栏 */
  inputToolbar?: React.ReactNode
  /** 空状态内容 */
  emptyContent?: React.ReactNode
  /** 加载中状态 */
  loading?: boolean
  /** 加载更多回调 */
  onLoadMore?: () => void
  /** 是否还有更多消息 */
  hasMore?: boolean
  /** 消息重试回调 */
  onMessageRetry?: (messageId: string) => void
  /** 自定义渲染消息 */
  renderMessage?: LMChatListProps['renderMessage']
  /** 输入框自动聚焦 */
  autoFocus?: boolean
  /** 按 Enter 发送 */
  enterToSend?: boolean
  /** 高度 */
  height?: string | number
  /** 最大高度 */
  maxHeight?: string | number
  /** 气泡最大宽度（默认 85%） */
  bubbleMaxWidth?: string | number
}

export interface LMChatContainerRef {
  /** 滚动到底部 */
  scrollToBottom: (behavior?: 'auto' | 'smooth') => void
  /** 滚动到指定消息 */
  scrollToMessage: (messageId: string, behavior?: 'auto' | 'smooth') => void
  /** 聚焦输入框 */
  focusInput: () => void
  /** 获取输入框值 */
  getInputValue: () => string
  /** 设置输入框值 */
  setInputValue: (value: string) => void
  /** 清空输入框 */
  clearInput: () => void
}

const LMChatContainer = forwardRef<LMChatContainerRef, LMChatContainerProps>(({
  messages,
  size = 'md',
  variant = 'default',
  onSend,
  onStop,
  isGenerating = false,
  disabled = false,
  placeholder = '输入消息...',
  inputValue,
  onInputChange,
  maxInputLength,
  showInputCount = false,
  showTypingIndicator = false,
  typingIndicatorText,
  typingIndicatorAvatar,
  className = '',
  header,
  footer,
  inputRightSlot,
  inputToolbar,
  emptyContent,
  loading = false,
  onLoadMore,
  hasMore = false,
  onMessageRetry,
  renderMessage,
  autoFocus = false,
  enterToSend = true,
  height,
  maxHeight,
  bubbleMaxWidth,
}, ref) => {
  const chatListRef = useRef<LMChatListRef>(null)
  const inputRef = useRef<string>('')
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)

  // 处理发送
  const handleSend = useCallback((value: string) => {
    if (!value.trim() || disabled || isGenerating) return
    onSend?.(value)
  }, [disabled, isGenerating, onSend])

  // 处理输入变化
  const handleInputChange = useCallback((value: string) => {
    inputRef.current = value
    onInputChange?.(value)
  }, [onInputChange])

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    scrollToBottom: (behavior) => {
      chatListRef.current?.scrollToBottom(behavior)
    },
    scrollToMessage: (messageId, behavior) => {
      chatListRef.current?.scrollToMessage(messageId, behavior)
    },
    focusInput: () => {
      // 输入框会自动处理聚焦
    },
    getInputValue: () => inputRef.current,
    setInputValue: (value) => {
      inputRef.current = value
      onInputChange?.(value)
    },
    clearInput: () => {
      inputRef.current = ''
      onInputChange?.('')
    },
  }), [onInputChange])

  // 容器样式
  const getContainerStyles = (): React.CSSProperties => ({
    backgroundColor: 'var(--lm-bg-default)',
    borderColor: 'var(--lm-border-default)',
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
    ...(maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } : {}),
  })

  return (
    <div
      className={`
        flex flex-col border rounded-2xl overflow-hidden
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={getContainerStyles()}
    >
      {/* 头部 */}
      {header && (
        <div
          className="shrink-0 border-b px-4 py-3"
          style={{
            backgroundColor: 'var(--lm-bg-elevated)',
            borderColor: 'var(--lm-border-default)',
          }}
        >
          {header}
        </div>
      )}

      {/* 消息列表 */}
      <LMChatList
        ref={chatListRef}
        messages={messages}
        size={resolvedSize}
        variant={variant}
        showTypingIndicator={showTypingIndicator}
        typingIndicatorText={typingIndicatorText}
        typingIndicatorAvatar={typingIndicatorAvatar}
        emptyContent={emptyContent}
        loading={loading}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        onMessageRetry={onMessageRetry}
        renderMessage={renderMessage}
        className="flex-1 min-h-0"
        bubbleMaxWidth={bubbleMaxWidth}
      />

      {/* 底部额外内容 */}
      {footer && (
        <div
          className="shrink-0 px-4 py-2 border-t"
          style={{ borderColor: 'var(--lm-border-light)' }}
        >
          {footer}
        </div>
      )}

      {/* 输入区域 */}
      <div
        className="shrink-0 p-4 border-t"
        style={{
          backgroundColor: 'var(--lm-bg-elevated)',
          borderColor: 'var(--lm-border-default)',
        }}
      >
        <LMChatInput
          value={inputValue}
          onChange={handleInputChange}
          onSend={handleSend}
          onStop={onStop}
          isGenerating={isGenerating}
          placeholder={placeholder}
          size={resolvedSize}
          disabled={disabled}
          sending={isGenerating}
          maxLength={maxInputLength}
          showCount={showInputCount}
          autoFocus={autoFocus}
          enterToSend={enterToSend}
          rightSlot={inputRightSlot}
          toolbar={inputToolbar}
        />
      </div>
    </div>
  )
})

LMChatContainer.displayName = 'LMChatContainer'

export default memo(LMChatContainer)
