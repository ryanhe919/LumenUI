/**
 * LMMessage - 消息提示组件
 * 用于全局消息通知，支持成功、错误、警告、信息等类型
 */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import LMMessage, { LMMessageContainer } from './LMMessage'
import { useMessage } from '../../../hooks/useMessage'
import LMButton from '../../General/LMButton/LMButton'

const meta: Meta<typeof LMMessage> = {
  title: '反馈 Feedback/LMMessage 消息提示',
  component: LMMessage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '全局消息提示组件，用于操作反馈。支持多种类型、自动关闭和位置配置。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: '消息类型',
    },
    title: {
      description: '消息标题',
    },
    content: {
      description: '消息内容',
    },
    duration: {
      description: '自动关闭时间（毫秒），0 表示不自动关闭',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 成功消息 - 绿色样式，表示操作成功 */
export const Success: Story = {
  args: {
    id: '1',
    type: 'success',
    title: 'Success',
    content: 'Your changes have been saved successfully.',
    duration: 0,
    onClose: () => console.log('Closed'),
  },
}

/** 错误消息 - 红色样式，表示操作失败 */
export const Error: Story = {
  args: {
    id: '2',
    type: 'error',
    title: 'Error',
    content: 'Something went wrong. Please try again.',
    duration: 0,
    onClose: () => console.log('Closed'),
  },
}

/** 警告消息 - 黄色样式，表示需要注意 */
export const Warning: Story = {
  args: {
    id: '3',
    type: 'warning',
    title: 'Warning',
    content: 'Your session is about to expire.',
    duration: 0,
    onClose: () => console.log('Closed'),
  },
}

/** 信息消息 - 蓝色样式，表示一般通知 */
export const Info: Story = {
  args: {
    id: '4',
    type: 'info',
    title: 'Information',
    content: 'New updates are available.',
    duration: 0,
    onClose: () => console.log('Closed'),
  },
}

/** 无标题消息 - 仅显示内容 */
export const WithoutTitle: Story = {
  args: {
    id: '5',
    type: 'success',
    content: 'Operation completed successfully.',
    duration: 0,
    onClose: () => console.log('Closed'),
  },
}

/** 使用 Hook - 通过 useMessage 钩子调用 */
export const WithHook: Story = {
  render: () => {
    const { messages, success, error, warning, info, removeMessage, clearAll } = useMessage()

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <LMButton
            size="sm"
            variant="success"
            onClick={() => success('Operation completed!', 'Success')}
          >
            Success
          </LMButton>
          <LMButton
            size="sm"
            variant="danger"
            onClick={() => error('Something went wrong!', 'Error')}
          >
            Error
          </LMButton>
          <LMButton
            size="sm"
            variant="warning"
            onClick={() => warning('Please be careful!', 'Warning')}
          >
            Warning
          </LMButton>
          <LMButton
            size="sm"
            variant="primary"
            onClick={() => info('Here is some information.', 'Info')}
          >
            Info
          </LMButton>
          <LMButton size="sm" variant="outline" onClick={clearAll}>
            Clear All
          </LMButton>
        </div>
        <LMMessageContainer messages={messages} onClose={removeMessage} position="top-center" />
      </div>
    )
  },
}

/** 位置配置 - 消息显示在不同位置 */
export const Positions: Story = {
  render: () => {
    const [position, setPosition] = useState<'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'>('top-right')
    const { messages, info, removeMessage, clearAll } = useMessage()

    const positions: Array<'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'> = [
      'top-right',
      'top-left',
      'top-center',
      'bottom-right',
      'bottom-left',
      'bottom-center',
    ]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {positions.map((pos) => (
            <LMButton
              key={pos}
              size="sm"
              variant={position === pos ? 'primary' : 'outline'}
              onClick={() => {
                setPosition(pos)
                clearAll()
              }}
            >
              {pos}
            </LMButton>
          ))}
        </div>
        <LMButton onClick={() => info(`Message at ${position}`, 'Position Demo', 3000)}>
          Show Message
        </LMButton>
        <LMMessageContainer messages={messages} onClose={removeMessage} position={position} />
      </div>
    )
  },
}

/** 自动关闭 - 指定时间后自动消失 */
export const AutoClose: Story = {
  render: () => {
    const { messages, success, removeMessage } = useMessage()

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>Messages will auto-close after 3 seconds</p>
        <LMButton
          onClick={() => success('This message will disappear in 3 seconds', 'Auto Close', 3000)}
        >
          Show Auto-Close Message
        </LMButton>
        <LMMessageContainer messages={messages} onClose={removeMessage} position="top-center" />
      </div>
    )
  },
}

/** 所有类型 - 展示全部消息样式 */
export const AllTypes: Story = {
  render: () => {
    const handleClose = (id: string) => console.log('Closed:', id)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '400px' }}>
        <LMMessage
          id="1"
          type="success"
          title="Success"
          content="Your profile has been updated successfully."
          duration={0}
          onClose={handleClose}
        />
        <LMMessage
          id="2"
          type="error"
          title="Error"
          content="Failed to save changes. Please try again."
          duration={0}
          onClose={handleClose}
        />
        <LMMessage
          id="3"
          type="warning"
          title="Warning"
          content="Your storage is almost full."
          duration={0}
          onClose={handleClose}
        />
        <LMMessage
          id="4"
          type="info"
          title="Information"
          content="A new version is available for download."
          duration={0}
          onClose={handleClose}
        />
      </div>
    )
  },
}
