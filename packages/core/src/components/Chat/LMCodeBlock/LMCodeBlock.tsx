import React, { memo, useState, useCallback, useMemo } from 'react'
import type { ComponentSize } from '../../../utils/componentSizes'
import { clampComponentSize, COMPONENT_SIZE_ORDER } from '../../../utils/componentSizes'

export interface LMCodeBlockProps {
  /** 代码内容 */
  code: string
  /** 编程语言 */
  language?: string
  /** 文件名（可选） */
  filename?: string
  /** 尺寸 */
  size?: ComponentSize
  /** 是否显示行号 */
  showLineNumbers?: boolean
  /** 起始行号 */
  startLineNumber?: number
  /** 高亮行（数组） */
  highlightLines?: number[]
  /** 是否显示复制按钮 */
  showCopyButton?: boolean
  /** 自定义类名 */
  className?: string
  /** 最大高度 */
  maxHeight?: string | number
  /** 是否允许换行 */
  wrapLines?: boolean
  /** 是否启用语法高亮 */
  enableHighlight?: boolean
}

/** 复制图标 */
const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)

/** 对勾图标 */
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

/** 语法高亮 CSS 变量名 */
const HIGHLIGHT_VARS = {
  keyword: '--lm-code-keyword',
  string: '--lm-code-string',
  number: '--lm-code-number',
  comment: '--lm-code-comment',
  function: '--lm-code-function',
  operator: '--lm-code-operator',
  className: '--lm-code-class',
  tag: '--lm-code-tag',
  property: '--lm-code-property',
  default: '--lm-code-default',
}

/** 简单的语法高亮器 */
const highlightCode = (code: string, language: string): React.ReactNode[] => {
  const lang = language.toLowerCase()

  // 通用关键字
  const keywords = {
    js: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|typeof|instanceof|in|of|class|extends|super|import|export|default|from|as|async|await|yield|static|get|set|null|undefined|true|false|this|void|delete|debugger)\b/g,
    ts: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|typeof|instanceof|in|of|class|extends|super|import|export|default|from|as|async|await|yield|static|get|set|null|undefined|true|false|this|void|delete|debugger|type|interface|enum|namespace|module|declare|abstract|implements|private|protected|public|readonly|keyof|infer|never|unknown|any)\b/g,
    py: /\b(def|return|if|elif|else|for|while|break|continue|try|except|finally|raise|import|from|as|class|with|yield|lambda|pass|None|True|False|and|or|not|in|is|global|nonlocal|assert|del|async|await|self)\b/g,
    go: /\b(func|return|if|else|for|range|switch|case|break|continue|go|select|defer|panic|recover|type|struct|interface|map|chan|package|import|const|var|nil|true|false|make|new|append|len|cap)\b/g,
    rust: /\b(fn|return|if|else|for|while|loop|match|break|continue|let|mut|const|static|struct|enum|impl|trait|type|pub|mod|use|crate|self|super|where|async|await|move|ref|unsafe|extern|dyn|true|false|None|Some|Ok|Err)\b/g,
  }

  const patterns: { pattern: RegExp; varName: string }[] = [
    // 注释
    { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm, varName: HIGHLIGHT_VARS.comment },
    // 字符串
    { pattern: /(['"`])(?:(?!\1)[^\\]|\\.)*\1/g, varName: HIGHLIGHT_VARS.string },
    // 模板字符串中的表达式
    { pattern: /\$\{[^}]+\}/g, varName: HIGHLIGHT_VARS.operator },
    // 数字
    { pattern: /\b(\d+\.?\d*|0x[a-fA-F0-9]+|0b[01]+|0o[0-7]+)\b/g, varName: HIGHLIGHT_VARS.number },
    // 函数调用
    { pattern: /\b([a-zA-Z_]\w*)\s*(?=\()/g, varName: HIGHLIGHT_VARS.function },
    // JSX/HTML 标签
    { pattern: /<\/?([a-zA-Z][a-zA-Z0-9]*)/g, varName: HIGHLIGHT_VARS.tag },
    // 类名 (大写开头)
    { pattern: /\b([A-Z][a-zA-Z0-9]*)\b/g, varName: HIGHLIGHT_VARS.className },
    // 操作符
    { pattern: /[+\-*/%=<>!&|^~?:]+|\.{3}/g, varName: HIGHLIGHT_VARS.operator },
  ]

  // 获取语言对应的关键字模式
  const keywordPattern = keywords[lang as keyof typeof keywords] || keywords.js

  // 收集所有匹配
  const allMatches: { start: number; end: number; text: string; varName: string }[] = []

  // 关键字匹配
  let match
  while ((match = keywordPattern.exec(code)) !== null) {
    allMatches.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
      varName: HIGHLIGHT_VARS.keyword,
    })
  }

  // 其他模式匹配
  for (const { pattern, varName } of patterns) {
    pattern.lastIndex = 0
    while ((match = pattern.exec(code)) !== null) {
      allMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        varName,
      })
    }
  }

  // 按位置排序
  allMatches.sort((a, b) => a.start - b.start || b.end - a.end)

  // 构建 token 列表
  const tokens: { text: string; varName?: string }[] = []
  let lastIndex = 0

  for (const m of allMatches) {
    if (m.start >= lastIndex) {
      if (m.start > lastIndex) {
        tokens.push({ text: code.slice(lastIndex, m.start) })
      }
      tokens.push({ text: m.text, varName: m.varName })
      lastIndex = m.end
    }
  }

  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex) })
  }

  return tokens.map((token, i) => (
    token.varName ? (
      <span key={i} style={{ color: `var(${token.varName})` }}>{token.text}</span>
    ) : (
      <span key={i}>{token.text}</span>
    )
  ))
}

/** 语言显示名称映射 */
const LANGUAGE_DISPLAY: Record<string, string> = {
  javascript: 'JS', typescript: 'TS', python: 'Python', java: 'Java',
  cpp: 'C++', c: 'C', csharp: 'C#', go: 'Go', rust: 'Rust', swift: 'Swift',
  kotlin: 'Kotlin', ruby: 'Ruby', php: 'PHP', html: 'HTML', css: 'CSS',
  json: 'JSON', yaml: 'YAML', sql: 'SQL', bash: 'Bash', shell: 'Shell',
  jsx: 'JSX', tsx: 'TSX', vue: 'Vue', svelte: 'Svelte', markdown: 'MD',
}

/** 代码字体尺寸配置 */
const CODE_SIZE: Record<ComponentSize, { fontSize: string; lineHeight: string; padding: string }> = {
  xs: { fontSize: '11px', lineHeight: '1.5', padding: '12px' },
  sm: { fontSize: '12px', lineHeight: '1.5', padding: '14px' },
  md: { fontSize: '13px', lineHeight: '1.6', padding: '16px' },
  lg: { fontSize: '14px', lineHeight: '1.6', padding: '18px' },
  xl: { fontSize: '14px', lineHeight: '1.7', padding: '20px' },
  '2xl': { fontSize: '15px', lineHeight: '1.7', padding: '24px' },
}

/** 代码高亮主题样式 */
const codeThemeStyles = `
  :root, [data-theme="light"] {
    --lm-code-bg: #f8fafc;
    --lm-code-border: #e2e8f0;
    --lm-code-text: #334155;
    --lm-code-line-number: #94a3b8;
    --lm-code-keyword: #8250df;
    --lm-code-string: #0a7d46;
    --lm-code-number: #cf5c00;
    --lm-code-comment: #6b7280;
    --lm-code-function: #0969da;
    --lm-code-operator: #cf222e;
    --lm-code-class: #953800;
    --lm-code-tag: #1a7f37;
    --lm-code-property: #0550ae;
  }
  [data-theme="dark"] {
    --lm-code-bg: #1e293b;
    --lm-code-border: #334155;
    --lm-code-text: #e2e8f0;
    --lm-code-line-number: #64748b;
    --lm-code-keyword: #c792ea;
    --lm-code-string: #c3e88d;
    --lm-code-number: #f78c6c;
    --lm-code-comment: #64748b;
    --lm-code-function: #82aaff;
    --lm-code-operator: #89ddff;
    --lm-code-class: #ffcb6b;
    --lm-code-tag: #f07178;
    --lm-code-property: #89ddff;
  }
`

const LMCodeBlock: React.FC<LMCodeBlockProps> = ({
  code,
  language = 'plaintext',
  filename,
  size = 'md',
  showLineNumbers = true,
  startLineNumber = 1,
  highlightLines = [],
  showCopyButton = true,
  className = '',
  maxHeight,
  wrapLines = false,
  enableHighlight = true,
}) => {
  const [copied, setCopied] = useState(false)

  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const sizeConfig = CODE_SIZE[resolvedSize]
  const lines = code.split('\n')
  const displayLang = LANGUAGE_DISPLAY[language.toLowerCase()] || language

  // 复制代码
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [code])

  // 行号宽度
  const lineNumWidth = String(lines.length + startLineNumber - 1).length

  // 高亮后的代码行
  const highlightedLines = useMemo(() => {
    if (!enableHighlight) return lines
    return lines.map(line => highlightCode(line, language))
  }, [lines, language, enableHighlight])

  return (
    <>
      <style>{codeThemeStyles}</style>
      <div
        className={`overflow-hidden ${className}`.trim()}
        style={{
          backgroundColor: 'var(--lm-code-bg)',
          borderRadius: 'var(--lm-radius-lg)',
          border: '1px solid var(--lm-code-border)',
          ...(maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight } : {}),
        }}
      >
        {/* 头部 */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{
            borderBottom: '1px solid var(--lm-code-border)',
          }}
        >
          <div className="flex items-center gap-2">
            {/* 语言标签 */}
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'var(--lm-code-border)',
                color: 'var(--lm-code-line-number)',
              }}
            >
              {displayLang}
            </span>

            {/* 文件名 */}
            {filename && (
              <span
                className="text-xs truncate max-w-[180px]"
                style={{ color: 'var(--lm-code-line-number)' }}
              >
                {filename}
              </span>
            )}
          </div>

          {/* 复制按钮 */}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition-colors duration-150 active:scale-95"
              style={{
                color: copied ? 'var(--lm-success-500)' : 'var(--lm-code-line-number)',
              }}
              aria-label={copied ? '已复制' : '复制'}
            >
              {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
              <span className="text-xs">{copied ? '已复制' : '复制'}</span>
            </button>
          )}
        </div>

        {/* 代码区域 */}
        <pre
          className="m-0 overflow-auto"
          style={{
            padding: sizeConfig.padding,
            fontSize: sizeConfig.fontSize,
            lineHeight: sizeConfig.lineHeight,
            fontFamily: '"SF Mono", ui-monospace, Menlo, Monaco, "Cascadia Code", monospace',
            color: 'var(--lm-code-text)',
          }}
        >
          <code>
            {lines.map((line, index) => {
              const lineNum = startLineNumber + index
              const isHighlighted = highlightLines.includes(lineNum)

              return (
                <div
                  key={index}
                  className="flex"
                  style={{
                    backgroundColor: isHighlighted ? 'var(--lm-primary-50)' : 'transparent',
                    marginLeft: isHighlighted ? '-4px' : '0',
                    paddingLeft: isHighlighted ? '4px' : '0',
                    borderLeft: isHighlighted ? '2px solid var(--lm-primary-500)' : 'none',
                  }}
                >
                  {/* 行号 */}
                  {showLineNumbers && (
                    <span
                      className="select-none text-right shrink-0 pr-4"
                      style={{
                        width: `${lineNumWidth + 2}ch`,
                        color: isHighlighted ? 'var(--lm-primary-500)' : 'var(--lm-code-line-number)',
                      }}
                    >
                      {lineNum}
                    </span>
                  )}

                  {/* 代码内容 */}
                  <span className={`flex-1 min-w-0 ${wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'}`}>
                    {enableHighlight ? highlightedLines[index] : (line || ' ')}
                  </span>
                </div>
              )
            })}
          </code>
        </pre>
      </div>
    </>
  )
}

export default memo(LMCodeBlock)
