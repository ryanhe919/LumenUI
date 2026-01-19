/**
 * LMMarkdownRenderer - Markdown 渲染组件
 * 用于渲染 AI 生成的 Markdown 内容，支持标题、列表、代码块、表格等
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMMarkdownRenderer from './LMMarkdownRenderer'

const meta: Meta<typeof LMMarkdownRenderer> = {
  title: '聊天 Chat/LMMarkdownRenderer Markdown渲染',
  component: LMMarkdownRenderer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Markdown 渲染组件，用于渲染 AI 生成的 Markdown 内容，支持标题、列表、代码块、表格等。',
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
    openLinksInNewTab: {
      control: 'boolean',
      description: '在新标签页打开链接',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const basicMarkdown = `# 标题一

这是一段普通的文本内容。

## 标题二

这是**粗体**文本，这是*斜体*文本，这是~~删除线~~文本。

### 标题三

这是一个[链接](https://example.com)。`

const listMarkdown = `## 列表示例

### 无序列表

- 第一项
- 第二项
- 第三项

### 有序列表

1. 步骤一
2. 步骤二
3. 步骤三`

const codeMarkdown = `## 代码示例

行内代码：\`const x = 1\`

代码块：

\`\`\`typescript
interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return { id, name: "John" };
}
\`\`\``

const tableMarkdown = `## 表格示例

| 功能 | 状态 | 说明 |
| --- | --- | --- |
| 用户登录 | 完成 | 支持邮箱和手机号 |
| 数据导出 | 进行中 | 支持 CSV 和 Excel |
| 实时通知 | 待开发 | 计划下个版本 |`

/** 基础 Markdown */
export const Basic: Story = {
  args: {
    content: basicMarkdown,
  },
}

/** 列表渲染 */
export const Lists: Story = {
  args: {
    content: listMarkdown,
  },
}

/** 代码块渲染 */
export const CodeBlocks: Story = {
  args: {
    content: codeMarkdown,
  },
}

/** 表格渲染 */
export const Table: Story = {
  args: {
    content: tableMarkdown,
  },
}

/** 引用渲染 */
export const Blockquote: Story = {
  args: {
    content: `## 引用示例

> 这是一段引用文本。
> 引用可以包含多行内容。

普通段落在引用之后。`,
  },
}

/** 行内样式 */
export const InlineStyles: Story = {
  args: {
    content: `这段文本包含 **粗体**、*斜体*、~~删除线~~ 和 \`行内代码\` 样式。`,
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="sm"</div>
        <LMMarkdownRenderer
          content={`## Small 尺寸

这是 **Small** 尺寸的渲染效果。`}
          size="sm"
        />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="md"</div>
        <LMMarkdownRenderer
          content={`## Medium 尺寸

这是 **Medium** 尺寸的渲染效果。`}
          size="md"
        />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="lg"</div>
        <LMMarkdownRenderer
          content={`## Large 尺寸

这是 **Large** 尺寸的渲染效果。`}
          size="lg"
        />
      </div>
    </div>
  ),
}

/** 完整示例 - AI 回复 */
export const FullExample: Story = {
  args: {
    content: `# AI 助手使用指南

欢迎使用 AI 助手！以下是一些使用技巧。

## 基本功能

AI 助手可以帮助你完成以下任务：

- 回答问题
- 编写代码
- 翻译文本
- 生成创意内容

## 代码生成示例

你可以让我生成各种编程语言的代码：

\`\`\`javascript
function Button({ children, onClick }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
\`\`\`

## 注意事项

> **提示**: 尽量清晰地描述你的需求，这样我能给出更准确的回答。

更多信息请访问 [帮助中心](https://help.example.com)。`,
  },
}
