'use client'

import { LiveProvider, LiveError, LivePreview as Preview } from 'react-live'
import * as LumenUI from '@ryanhe919/lumen-ui'
import React, { useState } from 'react'

interface LivePreviewProps {
  code: string
  noEditor?: boolean
}

const scope = {
  ...LumenUI,
  useState,
  React,
}

// 简单的 JSX 语法高亮
function highlightCode(code: string): React.ReactNode[] {
  const tokens: { text: string; type?: string }[] = []
  let remaining = code

  const patterns: { regex: RegExp; type: string }[] = [
    // 注释
    { regex: /^(\/\/.*$|\/\*[\s\S]*?\*\/|{\/\*[\s\S]*?\*\/})/m, type: 'comment' },
    // JSX 组件标签
    { regex: /^(<\/?[A-Z][a-zA-Z0-9]*)/, type: 'component' },
    // HTML 标签
    { regex: /^(<\/?[a-z][a-zA-Z0-9-]*)/, type: 'tag' },
    // 字符串（双引号、单引号、模板字符串）
    { regex: /^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, type: 'string' },
    // 模板字符串表达式
    { regex: /^(\$\{[^}]+\})/, type: 'expression' },
    // 属性名（在 = 之前）
    { regex: /^([a-zA-Z_][a-zA-Z0-9_]*)(=)/, type: 'attr' },
    // 关键字
    { regex: /^(true|false|null|undefined|const|let|var|function|return|if|else|for|while|import|export|from|as|default)\b/, type: 'keyword' },
    // 数字
    { regex: /^(\d+\.?\d*)/, type: 'number' },
    // 标点符号
    { regex: /^([{}[\]()=<>/,;:.]+)/, type: 'punctuation' },
    // 普通文本
    { regex: /^([a-zA-Z_][a-zA-Z0-9_]*)/, type: 'text' },
    // 空白
    { regex: /^(\s+)/, type: 'whitespace' },
    // 其他字符
    { regex: /^(.)/, type: 'text' },
  ]

  while (remaining.length > 0) {
    let matched = false

    for (const { regex, type } of patterns) {
      const match = remaining.match(regex)
      if (match) {
        if (type === 'attr') {
          // 属性名和等号分开处理
          tokens.push({ text: match[1], type: 'attr' })
          tokens.push({ text: match[2], type: 'punctuation' })
        } else {
          tokens.push({ text: match[0], type })
        }
        remaining = remaining.slice(match[0].length)
        matched = true
        break
      }
    }

    if (!matched) {
      tokens.push({ text: remaining[0], type: 'text' })
      remaining = remaining.slice(1)
    }
  }

  const colors: Record<string, string> = {
    comment: '#6b7280',
    component: '#c084fc',
    tag: '#22d3ee',
    string: '#86efac',
    expression: '#fbbf24',
    attr: '#93c5fd',
    keyword: '#f472b6',
    number: '#fdba74',
    punctuation: '#9ca3af',
    text: '#e5e7eb',
    whitespace: '',
  }

  return tokens.map((token, i) => (
    <span key={i} style={{ color: colors[token.type || 'text'] || '#e5e7eb' }}>
      {token.text}
    </span>
  ))
}

export function LivePreview({ code, noEditor = false }: LivePreviewProps) {
  const [showCode, setShowCode] = useState(false)

  // 原始代码（用于显示）
  const displayCode = code.trim()

  // 检测是否是函数组件定义
  const isFunctionComponent = /^function\s+([A-Z][a-zA-Z0-9]*)\s*\(/.test(displayCode)

  // 包装代码（用于 react-live 执行）
  let wrappedCode: string
  if (isFunctionComponent) {
    // 提取组件名
    const match = displayCode.match(/^function\s+([A-Z][a-zA-Z0-9]*)\s*\(/)
    const componentName = match ? match[1] : 'Demo'
    wrappedCode = `${displayCode}\nrender(<${componentName} />)`
  } else {
    wrappedCode = `render(${displayCode})`
  }

  return (
    <LiveProvider code={wrappedCode} scope={scope} noInline={true}>
      <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* 预览区域 */}
        <div className="p-6 bg-white dark:bg-gray-950">
          <Preview />
        </div>

        {/* 错误提示 */}
        <LiveError className="px-4 py-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border-t border-gray-200 dark:border-gray-800" />

        {/* 代码显示区域 */}
        {!noEditor && (
          <div className="border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setShowCode(!showCode)}
              className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-900 text-left flex items-center justify-between"
            >
              <span>{showCode ? '隐藏代码' : '显示代码'}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showCode ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCode && (
              <div className="bg-[#1e1e2e] text-gray-100 overflow-x-auto">
                <pre
                  className="p-4 text-sm leading-relaxed"
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
                  }}
                >
                  <code>{highlightCode(displayCode)}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </LiveProvider>
  )
}

export default LivePreview
