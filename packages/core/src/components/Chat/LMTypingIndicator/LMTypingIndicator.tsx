import React, { memo } from 'react'
import type { ComponentSize } from '../../../utils/componentSizes'
import { clampComponentSize, COMPONENT_SIZE_ORDER } from '../../../utils/componentSizes'

/** 打字指示器主题样式 */
const typingIndicatorThemeStyles = `
  :root, [data-theme="light"] {
    --lm-typing-bg: rgba(255, 255, 255, 0.85);
    --lm-typing-border: rgba(0, 0, 0, 0.06);
    --lm-typing-shadow: 0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
    --lm-typing-avatar-bg: linear-gradient(135deg, var(--lm-gray-100) 0%, var(--lm-gray-200) 100%);
  }
  [data-theme="dark"] {
    --lm-typing-bg: rgba(51, 65, 85, 0.85);
    --lm-typing-border: rgba(255, 255, 255, 0.08);
    --lm-typing-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1);
    --lm-typing-avatar-bg: linear-gradient(135deg, var(--lm-gray-700) 0%, var(--lm-gray-600) 100%);
  }
`

export type TypingIndicatorVariant = 'dots' | 'pulse' | 'wave' | 'bounce'

export interface LMTypingIndicatorProps {
  /** 变体样式 */
  variant?: TypingIndicatorVariant
  /** 尺寸 */
  size?: ComponentSize
  /** 显示文字（如 "正在输入..."） */
  text?: string
  /** 头像 */
  avatar?: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** 颜色 */
  color?: string
}

/** 尺寸配置 */
const SIZE_CONFIG: Record<ComponentSize, {
  dotSize: string
  gap: string
  padding: string
  fontSize: string
  avatarGap: string
}> = {
  xs: { dotSize: 'w-1.5 h-1.5', gap: 'gap-1', padding: 'px-3 py-2', fontSize: 'text-xs', avatarGap: 'gap-2' },
  sm: { dotSize: 'w-1.5 h-1.5', gap: 'gap-1', padding: 'px-3.5 py-2.5', fontSize: 'text-sm', avatarGap: 'gap-2.5' },
  md: { dotSize: 'w-2 h-2', gap: 'gap-1.5', padding: 'px-4 py-3', fontSize: 'text-sm', avatarGap: 'gap-3' },
  lg: { dotSize: 'w-2.5 h-2.5', gap: 'gap-1.5', padding: 'px-5 py-3.5', fontSize: 'text-base', avatarGap: 'gap-3' },
  xl: { dotSize: 'w-3 h-3', gap: 'gap-2', padding: 'px-5 py-4', fontSize: 'text-base', avatarGap: 'gap-4' },
  '2xl': { dotSize: 'w-3.5 h-3.5', gap: 'gap-2', padding: 'px-6 py-4.5', fontSize: 'text-lg', avatarGap: 'gap-4' },
}

/** 头像尺寸 */
const AVATAR_SIZE: Record<ComponentSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
  '2xl': 'w-14 h-14',
}

const LMTypingIndicator: React.FC<LMTypingIndicatorProps> = ({
  variant = 'dots',
  size = 'md',
  text,
  avatar,
  className = '',
  color,
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const config = SIZE_CONFIG[resolvedSize]

  // 获取点的动画样式 - 更流畅的时间曲线
  const getDotAnimation = (index: number): React.CSSProperties => {
    const baseDelay = index * 0.16

    switch (variant) {
      case 'dots':
        return {
          animation: `lm-typing-dots 1.4s cubic-bezier(0.4, 0, 0.2, 1) ${baseDelay}s infinite`,
        }
      case 'pulse':
        return {
          animation: `lm-typing-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) ${baseDelay}s infinite`,
        }
      case 'wave':
        return {
          animation: `lm-typing-wave 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${baseDelay}s infinite`,
        }
      case 'bounce':
        return {
          animation: `lm-typing-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${baseDelay}s infinite alternate`,
        }
      default:
        return {}
    }
  }

  // 内联 CSS 动画 - 更精致的动画效果
  const animationStyles = `
    @keyframes lm-typing-dots {
      0%, 80%, 100% {
        opacity: 0.35;
        transform: scale(0.85);
      }
      40% {
        opacity: 1;
        transform: scale(1.1);
      }
    }
    @keyframes lm-typing-pulse {
      0%, 100% {
        opacity: 0.3;
        transform: scale(0.9);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
    }
    @keyframes lm-typing-wave {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }
    @keyframes lm-typing-bounce {
      0% {
        transform: translateY(0) scale(1);
      }
      100% {
        transform: translateY(-6px) scale(1.1);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      [data-typing-indicator] span {
        animation: none !important;
        opacity: 0.6;
      }
    }
  `

  return (
    <>
      <style>{typingIndicatorThemeStyles}</style>
      <style>{animationStyles}</style>
      <div
        className={`
          flex items-center ${config.avatarGap}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        data-typing-indicator
      >
        {/* 头像 */}
        {avatar && (
          <div
            className={`
              ${AVATAR_SIZE[resolvedSize]}
              rounded-full overflow-hidden shrink-0
              flex items-center justify-center
            `.trim().replace(/\s+/g, ' ')}
            style={{
              background: 'var(--lm-typing-avatar-bg)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            {avatar}
          </div>
        )}

        {/* 指示器主体 - glassmorphism 效果 */}
        <div
          className={`
            inline-flex items-center
            ${config.padding}
          `.trim().replace(/\s+/g, ' ')}
          style={{
            backgroundColor: 'var(--lm-typing-bg)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid var(--lm-typing-border)',
            boxShadow: 'var(--lm-typing-shadow)',
            borderRadius: '20px 20px 20px 4px',
          }}
        >
          {/* 动画点 */}
          <div className={`flex items-center ${config.gap}`}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`
                  ${config.dotSize}
                  rounded-full
                `.trim()}
                style={{
                  backgroundColor: color || 'var(--lm-primary-500)',
                  ...getDotAnimation(i),
                }}
              />
            ))}
          </div>

          {/* 文字 */}
          {text && (
            <span
              className={`ml-2.5 font-medium ${config.fontSize}`}
              style={{ color: 'var(--lm-text-secondary)' }}
            >
              {text}
            </span>
          )}
        </div>
      </div>
    </>
  )
}

export default memo(LMTypingIndicator)
