/**
 * LMModal - 模态框组件
 * 用于在当前页面上层展示内容，需要用户处理后才能继续
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMModal from './LMModal'
import LMButton from '../../General/LMButton/LMButton'
import LMInput from '../../Form/LMInput/LMInput'

const meta: Meta<typeof LMModal> = {
  title: '反馈 Feedback/LMModal 模态框',
  component: LMModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '模态框组件，用于展示需要用户关注的内容。支持多种尺寸、自定义页脚和全屏模式。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '模态框尺寸',
    },
    centered: {
      control: 'boolean',
      description: '是否垂直居中',
    },
    fullscreen: {
      control: 'boolean',
      description: '是否全屏显示',
    },
    mask: {
      control: 'boolean',
      description: '是否显示遮罩',
    },
    maskClosable: {
      control: 'boolean',
      description: '是否允许点击遮罩关闭',
    },
    closable: {
      control: 'boolean',
      description: '是否显示关闭按钮',
    },
    visible: {
      description: '是否显示模态框',
    },
    title: {
      description: '模态框标题',
    },
    footer: {
      description: '自定义页脚，null 则不显示',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认模态框 - 基础的模态对话框 */
export const Default: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <LMButton onClick={() => setVisible(true)}>Open Modal</LMButton>
        <LMModal
          visible={visible}
          title="Modal Title"
          onClose={() => setVisible(false)}
        >
          <p>This is the modal content.</p>
        </LMModal>
      </>
    )
  },
}

/** 带表单 - 模态框中包含表单 */
export const WithForm: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <LMButton onClick={() => setVisible(true)}>Open Form Modal</LMButton>
        <LMModal
          visible={visible}
          title="User Profile"
          onClose={() => setVisible(false)}
          onOk={() => {
            console.log('Submitted')
            setVisible(false)
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <LMInput placeholder="Enter your name" />
            <LMInput type="email" placeholder="Enter your email" />
          </div>
        </LMModal>
      </>
    )
  },
}

/** 自定义页脚 - 完全自定义底部按钮 */
export const CustomFooter: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <LMButton onClick={() => setVisible(true)}>Custom Footer</LMButton>
        <LMModal
          visible={visible}
          title="Custom Footer Example"
          onClose={() => setVisible(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', padding: '16px' }}>
              <LMButton variant="outline" onClick={() => setVisible(false)}>Maybe Later</LMButton>
              <LMButton variant="primary" onClick={() => setVisible(false)}>Got it!</LMButton>
            </div>
          }
        >
          <p>This modal has a custom footer.</p>
        </LMModal>
      </>
    )
  },
}

/** 无页脚 - 只有内容区域 */
export const NoFooter: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <LMButton onClick={() => setVisible(true)}>No Footer</LMButton>
        <LMModal
          visible={visible}
          title="Information"
          onClose={() => setVisible(false)}
          footer={null}
          showOk={false}
          showCancel={false}
        >
          <p>This modal has no footer buttons.</p>
        </LMModal>
      </>
    )
  },
}

/** 点击遮罩关闭 - 允许点击外部关闭 */
export const MaskClosable: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <LMButton onClick={() => setVisible(true)}>Click Mask to Close</LMButton>
        <LMModal
          visible={visible}
          title="Click Outside to Close"
          onClose={() => setVisible(false)}
          maskClosable
        >
          <p>Click on the backdrop to close this modal.</p>
        </LMModal>
      </>
    )
  },
}

/** 加载状态 - 确认按钮显示加载 */
export const Loading: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleOk = () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setVisible(false)
      }, 2000)
    }
    return (
      <>
        <LMButton onClick={() => setVisible(true)}>With Loading</LMButton>
        <LMModal
          visible={visible}
          title="Confirm Action"
          onClose={() => setVisible(false)}
          onOk={handleOk}
          okLoading={loading}
        >
          <p>Click confirm to see the loading state.</p>
        </LMModal>
      </>
    )
  },
}

/** 全屏模式 - 占满整个屏幕 */
export const Fullscreen: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <LMButton onClick={() => setVisible(true)}>Fullscreen Modal</LMButton>
        <LMModal
          visible={visible}
          title="Fullscreen Modal"
          onClose={() => setVisible(false)}
          fullscreen
        >
          <p>This modal takes up the entire screen.</p>
        </LMModal>
      </>
    )
  },
}

/** 尺寸展示 - 不同宽度的模态框 */
export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null>(null)
    return (
      <>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <LMButton size="sm" onClick={() => setSize('xs')}>XS</LMButton>
          <LMButton size="sm" onClick={() => setSize('sm')}>SM</LMButton>
          <LMButton size="sm" onClick={() => setSize('md')}>MD</LMButton>
          <LMButton size="sm" onClick={() => setSize('lg')}>LG</LMButton>
          <LMButton size="sm" onClick={() => setSize('xl')}>XL</LMButton>
          <LMButton size="sm" onClick={() => setSize('2xl')}>2XL</LMButton>
        </div>
        <LMModal
          visible={size !== null}
          title={`${size?.toUpperCase()} Modal`}
          onClose={() => setSize(null)}
          size={size || 'md'}
        >
          <p>This is a {size} size modal.</p>
        </LMModal>
      </>
    )
  },
}
