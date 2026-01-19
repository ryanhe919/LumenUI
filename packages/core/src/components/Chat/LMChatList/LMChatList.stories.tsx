/**
 * LMChatList - 聊天消息列表组件
 * 用于渲染聊天消息列表，支持自动滚动、加载更多等功能
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMChatList from './LMChatList'
import type { ChatMessage } from './LMChatList'

const meta: Meta<typeof LMChatList> = {
  title: '聊天 Chat/LMChatList 消息列表',
  component: LMChatList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '聊天消息列表组件，用于渲染聊天消息，支持自动滚动、加载更多、打字指示器等功能。',
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
    showTypingIndicator: {
      control: 'boolean',
      description: '显示打字指示器',
    },
    autoScrollToBottom: {
      control: 'boolean',
      description: '自动滚动到底部',
    },
    loading: {
      control: 'boolean',
      description: '加载中状态',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: '你好！我想了解一下 React Hooks。',
    name: '用户',
    timestamp: '10:00',
  },
  {
    id: '2',
    role: 'assistant',
    content: '你好！React Hooks 是 React 16.8 引入的新特性，它让你在函数组件中使用 state 和其他 React 特性。最常用的 Hooks 包括 useState、useEffect、useContext 等。你想了解哪个方面？',
    name: 'AI 助手',
    timestamp: '10:01',
  },
  {
    id: '3',
    role: 'user',
    content: '请给我解释一下 useState 的用法',
    name: '用户',
    timestamp: '10:02',
  },
  {
    id: '4',
    role: 'assistant',
    content: 'useState 是最基本的 Hook，用于在函数组件中添加 state。基本用法：`const [count, setCount] = useState(0)`。这行代码声明了一个名为 count 的 state 变量，初始值为 0，setCount 是用来更新这个值的函数。',
    name: 'AI 助手',
    timestamp: '10:03',
  },
]

/** 基础消息列表 */
export const Default: Story = {
  args: {
    messages: sampleMessages,
  },
}

/** 空状态 */
export const Empty: Story = {
  args: {
    messages: [],
  },
}

/** 加载中状态 */
export const Loading: Story = {
  args: {
    messages: [],
    loading: true,
  },
}

/** 显示打字指示器 */
export const WithTypingIndicator: Story = {
  args: {
    messages: sampleMessages,
    showTypingIndicator: true,
    typingIndicatorText: 'AI 正在输入...',
  },
}

/** 带加载更多 */
export const WithLoadMore: Story = {
  args: {
    messages: sampleMessages,
    hasMore: true,
    loadMoreText: '加载更多消息',
    onLoadMore: () => console.log('加载更多'),
  },
}

/** 自定义空状态 */
export const CustomEmpty: Story = {
  args: {
    messages: [],
    emptyContent: (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
        <div style={{ color: '#666' }}>开始你的第一次对话吧！</div>
      </div>
    ),
  },
}

/** 长对话 */
export const LongConversation: Story = {
  args: {
    messages: [
      ...sampleMessages,
      {
        id: '5',
        role: 'user',
        content: '那 useEffect 呢？',
        name: '用户',
        timestamp: '10:04',
      },
      {
        id: '6',
        role: 'assistant',
        content: 'useEffect 用于在函数组件中执行副作用操作，如数据获取、订阅、手动修改 DOM 等。它接收两个参数：一个函数和一个依赖数组。',
        name: 'AI 助手',
        timestamp: '10:05',
      },
      {
        id: '7',
        role: 'user',
        content: '可以给我一个例子吗？',
        name: '用户',
        timestamp: '10:06',
      },
      {
        id: '8',
        role: 'assistant',
        content: '当然！这是一个获取数据的例子：\n\n```javascript\nuseEffect(() => {\n  fetchData();\n}, []);\n```\n\n空依赖数组意味着只在组件挂载时执行一次。',
        name: 'AI 助手',
        timestamp: '10:07',
      },
    ],
  },
}
