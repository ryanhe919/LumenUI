import React, { memo, useMemo } from 'react'
import type { ComponentSize } from '../../../utils/componentSizes'
import { clampComponentSize, COMPONENT_SIZE_ORDER } from '../../../utils/componentSizes'
import { LMCodeBlock } from '../LMCodeBlock'

export interface LMMarkdownRendererProps {
  /** Markdown 内容 */
  content: string
  /** 尺寸 */
  size?: ComponentSize
  /** 自定义类名 */
  className?: string
  /** 是否允许 HTML */
  allowHtml?: boolean
  /** 代码块渲染器（可自定义） */
  renderCodeBlock?: (code: string, language?: string, filename?: string) => React.ReactNode
  /** 链接点击处理 */
  onLinkClick?: (url: string, event: React.MouseEvent) => void
  /** 是否在新窗口打开链接 */
  openLinksInNewTab?: boolean
  /** 自定义渲染器（完全自定义解析） */
  customRenderer?: (content: string) => React.ReactNode
}

/** 文本尺寸配置 */
const TEXT_SIZE_CONFIG: Record<ComponentSize, {
  base: string
  h1: string
  h2: string
  h3: string
  code: string
}> = {
  xs: { base: 'text-xs', h1: 'text-lg', h2: 'text-base', h3: 'text-sm', code: 'text-[10px]' },
  sm: { base: 'text-sm', h1: 'text-xl', h2: 'text-lg', h3: 'text-base', code: 'text-xs' },
  md: { base: 'text-base', h1: 'text-2xl', h2: 'text-xl', h3: 'text-lg', code: 'text-sm' },
  lg: { base: 'text-lg', h1: 'text-3xl', h2: 'text-2xl', h3: 'text-xl', code: 'text-base' },
  xl: { base: 'text-xl', h1: 'text-4xl', h2: 'text-3xl', h3: 'text-2xl', code: 'text-lg' },
  '2xl': { base: 'text-2xl', h1: 'text-5xl', h2: 'text-4xl', h3: 'text-3xl', code: 'text-xl' },
}

/** 简单的 Markdown 解析 token 类型 */
type TokenType =
  | 'heading'
  | 'paragraph'
  | 'codeBlock'
  | 'blockquote'
  | 'list'
  | 'listItem'
  | 'hr'
  | 'table'

interface Token {
  type: TokenType
  content: string
  level?: number
  language?: string
  filename?: string
  ordered?: boolean
  items?: string[]
  rows?: string[][]
}

/** 解析 Markdown 为 tokens */
const parseMarkdown = (content: string): Token[] => {
  const tokens: Token[] = []
  const lines = content.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // 代码块
    if (line.startsWith('```')) {
      const match = line.match(/^```(\w+)?(?:\s+(.+))?/)
      const language = match?.[1] || 'plaintext'
      const filename = match?.[2]
      const codeLines: string[] = []
      i++

      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }

      tokens.push({
        type: 'codeBlock',
        content: codeLines.join('\n'),
        language,
        filename,
      })
      i++
      continue
    }

    // 标题
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      tokens.push({
        type: 'heading',
        content: headingMatch[2],
        level: headingMatch[1].length,
      })
      i++
      continue
    }

    // 水平线
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(line.trim())) {
      tokens.push({ type: 'hr', content: '' })
      i++
      continue
    }

    // 引用块
    if (line.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && (lines[i].startsWith('>') || lines[i].trim() === '')) {
        if (lines[i].startsWith('>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''))
        } else {
          quoteLines.push('')
        }
        i++
      }
      tokens.push({
        type: 'blockquote',
        content: quoteLines.join('\n').trim(),
      })
      continue
    }

    // 无序列表
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s/, ''))
        i++
      }
      tokens.push({
        type: 'list',
        content: '',
        ordered: false,
        items,
      })
      continue
    }

    // 有序列表
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      tokens.push({
        type: 'list',
        content: '',
        ordered: true,
        items,
      })
      continue
    }

    // 表格
    if (line.includes('|') && i + 1 < lines.length && /^\|?[\s-:|]+\|?$/.test(lines[i + 1])) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|')) {
        const cells = lines[i]
          .split('|')
          .map((cell) => cell.trim())
          .filter((cell) => cell !== '')
        if (cells.length > 0 && !/^[\s-:]+$/.test(cells.join(''))) {
          rows.push(cells)
        }
        i++
      }
      if (rows.length > 0) {
        tokens.push({
          type: 'table',
          content: '',
          rows,
        })
      }
      continue
    }

    // 空行跳过
    if (line.trim() === '') {
      i++
      continue
    }

    // 段落
    const paragraphLines: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('>') &&
      !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^(-{3,}|_{3,}|\*{3,})$/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i])
      i++
    }
    tokens.push({
      type: 'paragraph',
      content: paragraphLines.join('\n'),
    })
  }

  return tokens
}

/** 解析行内样式 */
const parseInlineStyles = (
  text: string,
  onLinkClick?: (url: string, event: React.MouseEvent) => void,
  openLinksInNewTab?: boolean
): React.ReactNode => {
  // 定义行内样式的正则表达式和对应的组件
  const patterns: Array<{
    regex: RegExp
    render: (match: RegExpMatchArray, key: number) => React.ReactNode
  }> = [
    // 粗体
    {
      regex: /\*\*(.+?)\*\*|__(.+?)__/g,
      render: (match, key) => (
        <strong key={key} className="font-semibold">
          {match[1] || match[2]}
        </strong>
      ),
    },
    // 斜体
    {
      regex: /\*(.+?)\*|_(.+?)_/g,
      render: (match, key) => (
        <em key={key} className="italic">
          {match[1] || match[2]}
        </em>
      ),
    },
    // 删除线
    {
      regex: /~~(.+?)~~/g,
      render: (match, key) => (
        <del key={key} className="line-through">
          {match[1]}
        </del>
      ),
    },
    // 行内代码
    {
      regex: /`([^`]+)`/g,
      render: (match, key) => (
        <code
          key={key}
          className="px-1.5 py-0.5 rounded-md font-mono text-[0.9em]"
          style={{
            backgroundColor: 'var(--lm-bg-paper)',
            color: 'var(--lm-primary-600)',
          }}
        >
          {match[1]}
        </code>
      ),
    },
    // 链接
    {
      regex: /\[([^\]]+)\]\(([^)]+)\)/g,
      render: (match, key) => (
        <a
          key={key}
          href={match[2]}
          onClick={(e) => onLinkClick?.(match[2], e)}
          target={openLinksInNewTab ? '_blank' : undefined}
          rel={openLinksInNewTab ? 'noopener noreferrer' : undefined}
          className="underline decoration-1 underline-offset-2 hover:opacity-80"
          style={{ color: 'var(--lm-primary-500)' }}
        >
          {match[1]}
        </a>
      ),
    },
  ]

  // 简化处理：按顺序应用每个模式
  let result: React.ReactNode[] = [text]
  let keyCounter = 0

  patterns.forEach(({ regex, render }) => {
    const newResult: React.ReactNode[] = []
    result.forEach((node) => {
      if (typeof node !== 'string') {
        newResult.push(node)
        return
      }

      let lastIndex = 0
      let match: RegExpExecArray | null
      const clonedRegex = new RegExp(regex.source, regex.flags)

      while ((match = clonedRegex.exec(node)) !== null) {
        if (match.index > lastIndex) {
          newResult.push(node.slice(lastIndex, match.index))
        }
        newResult.push(render(match, keyCounter++))
        lastIndex = match.index + match[0].length
      }

      if (lastIndex < node.length) {
        newResult.push(node.slice(lastIndex))
      }
    })
    result = newResult
  })

  return result
}

const LMMarkdownRenderer: React.FC<LMMarkdownRendererProps> = ({
  content,
  size = 'md',
  className = '',
  allowHtml: _allowHtml = false,
  renderCodeBlock,
  onLinkClick,
  openLinksInNewTab = true,
  customRenderer,
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const sizeConfig = TEXT_SIZE_CONFIG[resolvedSize]

  // 解析 Markdown（必须在所有条件返回之前调用 Hook）
  const tokens = useMemo(() => parseMarkdown(content), [content])

  // 使用自定义渲染器
  if (customRenderer) {
    return <div className={className}>{customRenderer(content)}</div>
  }

  // 渲染单个 token
  const renderToken = (token: Token, index: number): React.ReactNode => {
    switch (token.type) {
      case 'heading': {
        const HeadingTag = `h${token.level}` as keyof JSX.IntrinsicElements
        const headingSizeClass =
          token.level === 1 ? sizeConfig.h1 :
          token.level === 2 ? sizeConfig.h2 :
          sizeConfig.h3

        return (
          <HeadingTag
            key={index}
            className={`
              ${headingSizeClass}
              font-semibold leading-tight tracking-tight
              mt-6 mb-3 first:mt-0
            `.trim().replace(/\s+/g, ' ')}
            style={{ color: 'var(--lm-text-primary)' }}
          >
            {parseInlineStyles(token.content, onLinkClick, openLinksInNewTab)}
          </HeadingTag>
        )
      }

      case 'paragraph':
        return (
          <p
            key={index}
            className={`
              ${sizeConfig.base}
              leading-relaxed my-3 first:mt-0 last:mb-0
            `.trim().replace(/\s+/g, ' ')}
            style={{ color: 'var(--lm-text-primary)' }}
          >
            {parseInlineStyles(token.content, onLinkClick, openLinksInNewTab)}
          </p>
        )

      case 'codeBlock':
        if (renderCodeBlock) {
          return (
            <div key={index} className="my-4">
              {renderCodeBlock(token.content, token.language, token.filename)}
            </div>
          )
        }
        return (
          <div key={index} className="my-4">
            <LMCodeBlock
              code={token.content}
              language={token.language}
              filename={token.filename}
              size={resolvedSize}
            />
          </div>
        )

      case 'blockquote':
        return (
          <blockquote
            key={index}
            className="my-4 pl-4 border-l-4 italic"
            style={{
              borderColor: 'var(--lm-primary-300)',
              color: 'var(--lm-text-secondary)',
            }}
          >
            {parseInlineStyles(token.content, onLinkClick, openLinksInNewTab)}
          </blockquote>
        )

      case 'list': {
        const ListTag = token.ordered ? 'ol' : 'ul'
        return (
          <ListTag
            key={index}
            className={`
              ${sizeConfig.base}
              my-3 pl-6
              ${token.ordered ? 'list-decimal' : 'list-disc'}
            `.trim().replace(/\s+/g, ' ')}
            style={{ color: 'var(--lm-text-primary)' }}
          >
            {token.items?.map((item, i) => (
              <li key={i} className="my-1">
                {parseInlineStyles(item, onLinkClick, openLinksInNewTab)}
              </li>
            ))}
          </ListTag>
        )
      }

      case 'hr':
        return (
          <hr
            key={index}
            className="my-6 border-0 h-px"
            style={{ backgroundColor: 'var(--lm-border-default)' }}
          />
        )

      case 'table':
        return (
          <div key={index} className="my-4 overflow-x-auto">
            <table
              className="w-full border-collapse"
              style={{ borderColor: 'var(--lm-border-default)' }}
            >
              <thead>
                <tr>
                  {token.rows?.[0]?.map((cell, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-left font-semibold border"
                      style={{
                        backgroundColor: 'var(--lm-bg-paper)',
                        borderColor: 'var(--lm-border-default)',
                        color: 'var(--lm-text-primary)',
                      }}
                    >
                      {parseInlineStyles(cell, onLinkClick, openLinksInNewTab)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {token.rows?.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 border"
                        style={{
                          borderColor: 'var(--lm-border-default)',
                          color: 'var(--lm-text-primary)',
                        }}
                      >
                        {parseInlineStyles(cell, onLinkClick, openLinksInNewTab)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`${sizeConfig.base} ${className}`.trim()}>
      {tokens.map((token, index) => renderToken(token, index))}
    </div>
  )
}

export default memo(LMMarkdownRenderer)
