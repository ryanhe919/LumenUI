import React, { memo, useRef, useCallback, useState, useEffect } from 'react'
import type { ComponentSize } from '../../../utils/componentSizes'
import { clampComponentSize, COMPONENT_SIZE_ORDER, SIZE_TEXT_CLASSES } from '../../../utils/componentSizes'

/** 聊天输入框主题样式 */
const chatInputThemeStyles = `
  :root, [data-theme="light"] {
    --lm-chat-input-bg: rgba(255, 255, 255, 0.85);
    --lm-chat-input-bg-focus: rgba(255, 255, 255, 0.98);
    --lm-chat-input-border: rgba(0, 0, 0, 0.06);
    --lm-chat-input-border-focus: rgba(0, 0, 0, 0.12);
    --lm-chat-input-shadow: 0 2px 12px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02);
    --lm-chat-input-shadow-focus: 0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  }
  [data-theme="dark"] {
    --lm-chat-input-bg: rgba(30, 41, 59, 0.85);
    --lm-chat-input-bg-focus: rgba(30, 41, 59, 0.98);
    --lm-chat-input-border: rgba(255, 255, 255, 0.08);
    --lm-chat-input-border-focus: rgba(255, 255, 255, 0.15);
    --lm-chat-input-shadow: 0 2px 12px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1);
    --lm-chat-input-shadow-focus: 0 4px 24px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15);
  }
`

export interface LMChatInputProps {
  /** 输入值 */
  value?: string
  /** 值变化回调 */
  onChange?: (value: string) => void
  /** 发送消息回调 */
  onSend?: (value: string) => void
  /** 占位符文本 */
  placeholder?: string
  /** 尺寸 */
  size?: ComponentSize
  /** 是否禁用 */
  disabled?: boolean
  /** 是否正在发送（加载状态） */
  sending?: boolean
  /** 最大字符数 */
  maxLength?: number
  /** 显示字符计数 */
  showCount?: boolean
  /** 最大高度 */
  maxRows?: number
  /** 自定义类名 */
  className?: string
  /** 是否自动聚焦 */
  autoFocus?: boolean
  /** 发送按钮文本 */
  sendButtonText?: string
  /** 是否显示发送按钮 */
  showSendButton?: boolean
  /** 右侧自定义内容（发送按钮之前） */
  rightSlot?: React.ReactNode
  /** 底部工具栏 */
  toolbar?: React.ReactNode
  /** 是否按 Enter 发送（Shift+Enter 换行） */
  enterToSend?: boolean
  /** 停止生成回调（显示停止按钮） */
  onStop?: () => void
  /** 是否正在生成 */
  isGenerating?: boolean
}

/** 工具栏按钮组件 */
export interface ToolbarButtonProps {
  icon: React.ReactNode
  label?: string
  onClick?: () => void
  disabled?: boolean
  active?: boolean
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer
      transition-all duration-150
      disabled:opacity-40 disabled:cursor-not-allowed
      hover:bg-[var(--lm-bg-hover)] active:scale-95
    `.trim().replace(/\s+/g, ' ')}
    style={{
      backgroundColor: active ? 'var(--lm-primary-50)' : 'transparent',
      color: active ? 'var(--lm-primary-600)' : 'var(--lm-text-tertiary)',
    }}
    title={label}
  >
    <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
    {label && <span className="text-xs font-medium">{label}</span>}
  </button>
)

/** 发送图标 - 更现代的箭头设计 */
const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
)

/** 停止图标 - 更圆润的设计 */
const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <rect x="6" y="6" width="12" height="12" rx="3" />
  </svg>
)

/** 加载图标 - 更流畅的动画 */
const LoadingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeOpacity="0.2"
    />
    <path
      d="M12 2C6.5 2 2 6.5 2 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="0.8s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
)

/** 尺寸配置 */
const SIZE_CONFIG: Record<ComponentSize, {
  minHeight: string
  padding: string
  buttonSize: string
  iconSize: string
  gap: string
  sendButtonSize: string
  sendIconSize: string
}> = {
  xs: { minHeight: '28px', padding: 'px-3 py-2', buttonSize: 'w-6 h-6', iconSize: 'w-3 h-3', gap: 'gap-2', sendButtonSize: 'w-6 h-6', sendIconSize: 'w-3 h-3' },
  sm: { minHeight: '32px', padding: 'px-3.5 py-2.5', buttonSize: 'w-7 h-7', iconSize: 'w-3.5 h-3.5', gap: 'gap-2.5', sendButtonSize: 'w-7 h-7', sendIconSize: 'w-3.5 h-3.5' },
  md: { minHeight: '36px', padding: 'px-4 py-3', buttonSize: 'w-8 h-8', iconSize: 'w-4 h-4', gap: 'gap-3', sendButtonSize: 'w-8 h-8', sendIconSize: 'w-4 h-4' },
  lg: { minHeight: '44px', padding: 'px-5 py-3.5', buttonSize: 'w-9 h-9', iconSize: 'w-4.5 h-4.5', gap: 'gap-3', sendButtonSize: 'w-9 h-9', sendIconSize: 'w-4.5 h-4.5' },
  xl: { minHeight: '52px', padding: 'px-5 py-4', buttonSize: 'w-10 h-10', iconSize: 'w-5 h-5', gap: 'gap-4', sendButtonSize: 'w-10 h-10', sendIconSize: 'w-5 h-5' },
  '2xl': { minHeight: '60px', padding: 'px-6 py-4.5', buttonSize: 'w-11 h-11', iconSize: 'w-5.5 h-5.5', gap: 'gap-4', sendButtonSize: 'w-11 h-11', sendIconSize: 'w-5.5 h-5.5' },
}

const LMChatInput: React.FC<LMChatInputProps> = ({
  value = '',
  onChange,
  onSend,
  placeholder = '输入消息...',
  size = 'md',
  disabled = false,
  sending = false,
  maxLength,
  showCount = false,
  maxRows = 6,
  className = '',
  autoFocus = false,
  sendButtonText,
  showSendButton = true,
  rightSlot,
  toolbar,
  enterToSend = true,
  onStop,
  isGenerating = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(value)

  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const config = SIZE_CONFIG[resolvedSize]

  // 同步外部 value
  useEffect(() => {
    setInternalValue(value)
  }, [value])

  // 自动调整高度
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24
    const maxHeight = lineHeight * maxRows
    const newHeight = Math.min(textarea.scrollHeight, maxHeight)
    textarea.style.height = `${newHeight}px`
  }, [maxRows])

  useEffect(() => {
    adjustHeight()
  }, [internalValue, adjustHeight])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) return

    setInternalValue(newValue)
    onChange?.(newValue)
  }, [maxLength, onChange])

  const handleSend = useCallback(() => {
    const trimmedValue = internalValue.trim()
    if (!trimmedValue || disabled || sending) return

    onSend?.(trimmedValue)
    setInternalValue('')
    onChange?.('')

    // 重置高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [internalValue, disabled, sending, onSend, onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (enterToSend && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [enterToSend, handleSend])

  const handleStop = useCallback(() => {
    onStop?.()
  }, [onStop])

  const isDisabled = disabled || sending
  const canSend = internalValue.trim().length > 0 && !isDisabled
  const showStopButton = isGenerating && onStop

  // 容器样式 - 更现代的 glassmorphism 效果
  const getContainerStyles = (): React.CSSProperties => ({
    backgroundColor: isFocused
      ? 'var(--lm-chat-input-bg-focus)'
      : 'var(--lm-chat-input-bg)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderColor: isFocused
      ? 'var(--lm-chat-input-border-focus)'
      : 'var(--lm-chat-input-border)',
    boxShadow: isFocused
      ? 'var(--lm-chat-input-shadow-focus)'
      : 'var(--lm-chat-input-shadow)',
    transition: 'all var(--lm-transition-normal) var(--lm-ease-out)',
  } as React.CSSProperties)

  // 发送按钮样式 - 更精致的渐变效果
  const getSendButtonStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      transition: 'all var(--lm-transition-fast) var(--lm-ease-spring)',
      borderRadius: 'var(--lm-radius-md)',
    }

    if (showStopButton) {
      return {
        ...baseStyles,
        background: 'linear-gradient(135deg, var(--lm-error-500) 0%, var(--lm-error-600) 100%)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
      }
    }

    if (canSend) {
      return {
        ...baseStyles,
        background: 'linear-gradient(135deg, var(--lm-primary-500) 0%, var(--lm-primary-600) 100%)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)',
      }
    }

    return {
      ...baseStyles,
      backgroundColor: 'var(--lm-gray-100)',
      color: 'var(--lm-gray-400)',
    }
  }

  return (
    <>
      <style>{chatInputThemeStyles}</style>
      <div
        className={`
          relative flex flex-col border rounded-2xl
          ${config.padding}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        style={getContainerStyles()}
      >
      {/* 输入区域 */}
      <div className={`flex items-start ${config.gap}`}>
        {/* 输入框 */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isDisabled}
            autoFocus={autoFocus}
            rows={1}
            className={`
              w-full resize-none bg-transparent leading-relaxed
              outline-none focus:outline-none focus:ring-0 border-none
              ${SIZE_TEXT_CLASSES[resolvedSize]}
              placeholder:text-[var(--lm-text-tertiary)]
              disabled:text-[var(--lm-text-disabled)] disabled:cursor-not-allowed
            `.trim().replace(/\s+/g, ' ')}
            style={{
              color: 'var(--lm-text-primary)',
              minHeight: config.minHeight,
              maxHeight: `calc(${config.minHeight} * ${maxRows})`,
              outline: 'none',
              boxShadow: 'none',
            }}
          />
        </div>

        {/* 右侧插槽 */}
        {rightSlot && (
          <div className="flex items-center shrink-0 pt-0.5">
            {rightSlot}
          </div>
        )}
      </div>

      {/* 底部工具栏 */}
      <div className="flex items-center justify-between mt-2 -mb-1">
        {/* 左侧工具栏 */}
        <div className="flex items-center gap-0.5">
          {toolbar}
        </div>

        {/* 右侧：字符计数 + 发送按钮 */}
        <div className="flex items-center gap-2">
          {/* 字符计数 */}
          {showCount && (
            <span
              className="text-xs font-medium"
              style={{
                color: maxLength && internalValue.length > maxLength * 0.9
                  ? 'var(--lm-warning-500)'
                  : 'var(--lm-text-tertiary)'
              }}
            >
              {internalValue.length}{maxLength ? `/${maxLength}` : ''}
            </span>
          )}

          {/* 发送/停止按钮 */}
          {showSendButton && (
            <button
              type="button"
              onClick={showStopButton ? handleStop : handleSend}
              disabled={!showStopButton && !canSend}
              className={`
                ${config.sendButtonSize}
                flex items-center justify-center shrink-0
                cursor-pointer select-none
                focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-50
                hover:scale-105 active:scale-95
              `.trim().replace(/\s+/g, ' ')}
              style={getSendButtonStyles()}
              aria-label={showStopButton ? '停止生成' : '发送消息'}
            >
              {sending ? (
                <LoadingIcon className={config.sendIconSize} />
              ) : showStopButton ? (
                <StopIcon className={config.sendIconSize} />
              ) : sendButtonText ? (
                <span className={`${SIZE_TEXT_CLASSES[resolvedSize]} font-medium`}>{sendButtonText}</span>
              ) : (
                <SendIcon className={config.sendIconSize} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default memo(LMChatInput)
