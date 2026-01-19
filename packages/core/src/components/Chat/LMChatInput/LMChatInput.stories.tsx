/**
 * LMChatInput - 聊天输入框组件
 * 用于 AI 聊天应用的消息输入，支持多行、发送按钮、工具栏等功能
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMChatInput, { ToolbarButton } from './LMChatInput'

const meta: Meta<typeof LMChatInput> = {
  title: '聊天 Chat/LMChatInput 聊天输入框',
  component: LMChatInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '聊天输入框组件，支持多行输入、发送按钮、底部工具栏等功能。适用于 AI 聊天应用。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '输入框尺寸',
    },
    placeholder: {
      control: 'text',
      description: '占位符文本',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    sending: {
      control: 'boolean',
      description: '是否正在发送',
    },
    showCount: {
      control: 'boolean',
      description: '显示字符计数',
    },
    maxLength: {
      control: 'number',
      description: '最大字符数',
    },
    enterToSend: {
      control: 'boolean',
      description: '按 Enter 发送',
    },
    showSendButton: {
      control: 'boolean',
      description: '显示发送按钮',
    },
    isGenerating: {
      control: 'boolean',
      description: '是否正在生成',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/** 图标组件 */
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
  </svg>
)

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </svg>
)

const AtIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94" />
  </svg>
)

const EmojiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth={2} />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth={2} />
  </svg>
)

/** 默认输入框 - 基础聊天输入 */
export const Default: Story = {
  args: {
    placeholder: '输入消息...',
    size: 'md',
  },
}

/** 带工具栏 - 底部自定义工具按钮 */
export const WithToolbar: Story = {
  args: {
    placeholder: '输入消息...',
    toolbar: (
      <>
        <ToolbarButton icon={<ImageIcon />} label="图片" onClick={() => console.log('图片')} />
        <ToolbarButton icon={<MicIcon />} onClick={() => console.log('语音')} />
        <ToolbarButton icon={<CodeIcon />} onClick={() => console.log('代码')} />
        <ToolbarButton icon={<AtIcon />} onClick={() => console.log('@提及')} />
        <ToolbarButton icon={<EmojiIcon />} onClick={() => console.log('表情')} />
      </>
    ),
  },
}

/** 完整功能 - 工具栏 + 字符计数 */
export const FullFeature: Story = {
  args: {
    placeholder: '输入消息...',
    showCount: true,
    maxLength: 500,
    toolbar: (
      <>
        <ToolbarButton icon={<ImageIcon />} onClick={() => {}} />
        <ToolbarButton icon={<MicIcon />} onClick={() => {}} />
        <ToolbarButton icon={<CodeIcon />} onClick={() => {}} />
      </>
    ),
  },
}

/** 带默认值 - 显示预设内容 */
export const WithValue: Story = {
  args: {
    value: '你好，请帮我写一段代码',
    placeholder: '输入消息...',
    onChange: () => {},
  },
}

/** 显示字符计数 - 带字符限制 */
export const WithCount: Story = {
  args: {
    placeholder: '最多 200 字...',
    showCount: true,
    maxLength: 200,
  },
}

/** 发送中状态 - 显示加载动画 */
export const Sending: Story = {
  args: {
    placeholder: '输入消息...',
    sending: true,
    value: '正在发送的消息内容',
    onChange: () => {},
  },
}

/** 禁用状态 - 不可输入 */
export const Disabled: Story = {
  args: {
    placeholder: '输入框已禁用',
    disabled: true,
  },
}

/** 正在生成 - 显示停止按钮 */
export const Generating: Story = {
  args: {
    placeholder: '输入消息...',
    isGenerating: true,
    onStop: () => console.log('停止生成'),
  },
}

/** 不显示发送按钮 */
export const WithoutSendButton: Story = {
  args: {
    placeholder: '输入消息...',
    showSendButton: false,
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LMChatInput size="xs" placeholder="Extra Small" />
      <LMChatInput size="sm" placeholder="Small" />
      <LMChatInput size="md" placeholder="Medium" />
      <LMChatInput size="lg" placeholder="Large" />
      <LMChatInput size="xl" placeholder="Extra Large" />
      <LMChatInput size="2xl" placeholder="2X Large" />
    </div>
  ),
}
