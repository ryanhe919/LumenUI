/**
 * LMCodeBlock - 代码块组件
 * 用于展示代码，支持语法高亮、行号显示、复制功能等
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMCodeBlock from './LMCodeBlock'

const meta: Meta<typeof LMCodeBlock> = {
  title: '聊天 Chat/LMCodeBlock 代码块',
  component: LMCodeBlock,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '代码块组件，支持语法高亮、行号显示、复制功能等。适用于展示 AI 生成的代码。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: 'select',
      options: ['javascript', 'typescript', 'python', 'java', 'go', 'rust', 'html', 'css', 'json', 'bash'],
      description: '编程语言',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '尺寸',
    },
    showLineNumbers: {
      control: 'boolean',
      description: '显示行号',
    },
    showCopyButton: {
      control: 'boolean',
      description: '显示复制按钮',
    },
    wrapLines: {
      control: 'boolean',
      description: '允许换行',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const jsCode = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return {
    message: \`Welcome, \${name}\`,
    timestamp: Date.now()
  };
}

// 调用函数
const result = greet("World");
console.log(result);`

const tsCode = `interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}

// 使用示例
const user = await fetchUser(1);
console.log(user.name);`

const pythonCode = `def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence up to n numbers."""
    if n <= 0:
        return []
    elif n == 1:
        return [0]

    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])

    return sequence

# 生成前 10 个斐波那契数
result = fibonacci(10)
print(f"Fibonacci sequence: {result}")`

/** JavaScript 代码 */
export const JavaScript: Story = {
  args: {
    code: jsCode,
    language: 'javascript',
  },
}

/** TypeScript 代码 */
export const TypeScript: Story = {
  args: {
    code: tsCode,
    language: 'typescript',
  },
}

/** Python 代码 */
export const Python: Story = {
  args: {
    code: pythonCode,
    language: 'python',
  },
}

/** 带文件名 */
export const WithFilename: Story = {
  args: {
    code: tsCode,
    language: 'typescript',
    filename: 'src/utils/user.ts',
  },
}

/** 不显示行号 */
export const WithoutLineNumbers: Story = {
  args: {
    code: jsCode,
    language: 'javascript',
    showLineNumbers: false,
  },
}

/** 高亮特定行 */
export const HighlightLines: Story = {
  args: {
    code: jsCode,
    language: 'javascript',
    highlightLines: [2, 3, 4, 5],
  },
}

/** 限制高度 */
export const WithMaxHeight: Story = {
  args: {
    code: tsCode,
    language: 'typescript',
    maxHeight: 200,
  },
}

/** 允许换行 */
export const WrapLines: Story = {
  args: {
    code: `const longString = "This is a very long string that will wrap to the next line when the wrapLines option is enabled.";`,
    language: 'javascript',
    wrapLines: true,
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="sm"</div>
        <LMCodeBlock code={`console.log("Small");`} language="javascript" size="sm" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="md"</div>
        <LMCodeBlock code={`console.log("Medium");`} language="javascript" size="md" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>size="lg"</div>
        <LMCodeBlock code={`console.log("Large");`} language="javascript" size="lg" />
      </div>
    </div>
  ),
}

/** JSON 格式 */
export const JSON: Story = {
  args: {
    code: `{
  "name": "lumen-ui",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}`,
    language: 'json',
    filename: 'package.json',
  },
}
