/**
 * LMDrawer - 抽屉组件
 * 从屏幕边缘滑出的浮层面板
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMDrawer from './LMDrawer'
import { LMButton } from '../../General/LMButton'
import { LMInput } from '../../Form/LMInput'

const meta: Meta<typeof LMDrawer> = {
  title: '反馈 Feedback/LMDrawer 抽屉',
  component: LMDrawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '抽屉组件，从屏幕边缘滑出的浮层面板。支持四个方向、自定义尺寸、遮罩控制等。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: '抽屉弹出方向',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '组件尺寸',
    },
    closable: {
      control: 'boolean',
      description: '显示关闭按钮',
    },
    mask: {
      control: 'boolean',
      description: '显示遮罩',
    },
    maskClosable: {
      control: 'boolean',
      description: '点击遮罩关闭',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认抽屉 - 右侧弹出 */
export const Default: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton onClick={() => setVisible(true)}>打开抽屉</LMButton>
        <LMDrawer
          visible={visible}
          title="抽屉标题"
          onClose={() => setVisible(false)}
        >
          <p>这是抽屉的内容区域。</p>
          <p style={{ marginTop: '16px' }}>可以放置任意内容。</p>
        </LMDrawer>
      </>
    )
  },
}

/** 左侧抽屉 - 从左边滑出 */
export const LeftPlacement: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton onClick={() => setVisible(true)}>左侧抽屉</LMButton>
        <LMDrawer
          visible={visible}
          title="左侧抽屉"
          placement="left"
          onClose={() => setVisible(false)}
        >
          <p>从左侧滑出的抽屉内容。</p>
        </LMDrawer>
      </>
    )
  },
}

/** 顶部抽屉 - 从顶部滑出 */
export const TopPlacement: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton onClick={() => setVisible(true)}>顶部抽屉</LMButton>
        <LMDrawer
          visible={visible}
          title="顶部抽屉"
          placement="top"
          height={300}
          onClose={() => setVisible(false)}
        >
          <p>从顶部滑出的抽屉内容。</p>
        </LMDrawer>
      </>
    )
  },
}

/** 底部抽屉 - 从底部滑出 */
export const BottomPlacement: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton onClick={() => setVisible(true)}>底部抽屉</LMButton>
        <LMDrawer
          visible={visible}
          title="底部抽屉"
          placement="bottom"
          height={300}
          onClose={() => setVisible(false)}
        >
          <p>从底部滑出的抽屉内容。</p>
        </LMDrawer>
      </>
    )
  },
}

/** 自定义宽度 - 不同尺寸 */
export const CustomWidth: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton onClick={() => setVisible(true)}>大宽度抽屉</LMButton>
        <LMDrawer
          visible={visible}
          title="大宽度抽屉"
          width={600}
          onClose={() => setVisible(false)}
        >
          <p>这是一个 600px 宽的抽屉。</p>
        </LMDrawer>
      </>
    )
  },
}

/** 带页脚 - 底部按钮 */
export const WithFooter: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton onClick={() => setVisible(true)}>带页脚抽屉</LMButton>
        <LMDrawer
          visible={visible}
          title="编辑信息"
          onClose={() => setVisible(false)}
          footer={
            <>
              <LMButton variant="outline" onClick={() => setVisible(false)}>取消</LMButton>
              <LMButton variant="primary" onClick={() => setVisible(false)}>确定</LMButton>
            </>
          }
        >
          <p style={{ marginBottom: '16px' }}>请填写以下信息：</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <LMInput placeholder="请输入名称" />
            <LMInput placeholder="请输入描述" />
          </div>
        </LMDrawer>
      </>
    )
  },
}

/** 带额外操作 - 标题栏右侧 */
export const WithExtra: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton onClick={() => setVisible(true)}>带额外操作</LMButton>
        <LMDrawer
          visible={visible}
          title="任务详情"
          onClose={() => setVisible(false)}
          extra={
            <LMButton size="sm" variant="primary">
              编辑
            </LMButton>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p><strong>任务名称：</strong>完成组件库开发</p>
            <p><strong>状态：</strong>进行中</p>
            <p><strong>截止日期：</strong>2024-02-01</p>
          </div>
        </LMDrawer>
      </>
    )
  },
}

/** 无遮罩 - 透明背景 */
export const NoMask: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton onClick={() => setVisible(true)}>无遮罩抽屉</LMButton>
        <LMDrawer
          visible={visible}
          title="无遮罩"
          mask={false}
          onClose={() => setVisible(false)}
        >
          <p>这个抽屉没有遮罩层。</p>
        </LMDrawer>
      </>
    )
  },
}

/** 点击遮罩不关闭 - 强制交互 */
export const MaskNotClosable: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton onClick={() => setVisible(true)}>点击遮罩不关闭</LMButton>
        <LMDrawer
          visible={visible}
          title="点击遮罩不关闭"
          maskClosable={false}
          onClose={() => setVisible(false)}
          footer={
            <LMButton variant="primary" onClick={() => setVisible(false)}>
              确认关闭
            </LMButton>
          }
        >
          <p>只能通过点击关闭按钮或确认按钮关闭此抽屉。</p>
        </LMDrawer>
      </>
    )
  },
}

/** 无关闭按钮 - 隐藏关闭 */
export const NotClosable: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton onClick={() => setVisible(true)}>无关闭按钮</LMButton>
        <LMDrawer
          visible={visible}
          title="无关闭按钮"
          closable={false}
          onClose={() => setVisible(false)}
          footer={
            <LMButton variant="primary" onClick={() => setVisible(false)}>
              关闭
            </LMButton>
          }
        >
          <p>这个抽屉没有右上角的关闭按钮。</p>
        </LMDrawer>
      </>
    )
  },
}

/** 所有方向 - 位置对比 */
export const AllPlacements: Story = {
  render: () => {
    const [placement, setPlacement] = useState<'top' | 'right' | 'bottom' | 'left' | null>(null)

    return (
      <>
        <div style={{ display: 'flex', gap: '8px' }}>
          <LMButton onClick={() => setPlacement('top')}>Top</LMButton>
          <LMButton onClick={() => setPlacement('right')}>Right</LMButton>
          <LMButton onClick={() => setPlacement('bottom')}>Bottom</LMButton>
          <LMButton onClick={() => setPlacement('left')}>Left</LMButton>
        </div>
        <LMDrawer
          visible={placement !== null}
          title={`${placement} 抽屉`}
          placement={placement || 'right'}
          width={300}
          height={250}
          onClose={() => setPlacement(null)}
        >
          <p>从 {placement} 方向滑出的抽屉。</p>
        </LMDrawer>
      </>
    )
  },
}

/** 尺寸对比 - 不同 size */
export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | null>(null)

    return (
      <>
        <div style={{ display: 'flex', gap: '8px' }}>
          <LMButton size="xs" onClick={() => setSize('xs')}>XS</LMButton>
          <LMButton size="sm" onClick={() => setSize('sm')}>SM</LMButton>
          <LMButton size="md" onClick={() => setSize('md')}>MD</LMButton>
          <LMButton size="lg" onClick={() => setSize('lg')}>LG</LMButton>
        </div>
        <LMDrawer
          visible={size !== null}
          title={`${size?.toUpperCase()} 尺寸`}
          size={size || 'md'}
          onClose={() => setSize(null)}
          footer={
            <LMButton size={size || 'md'} variant="primary" onClick={() => setSize(null)}>
              确定
            </LMButton>
          }
        >
          <p>这是 {size} 尺寸的抽屉，内边距和字体大小会相应调整。</p>
        </LMDrawer>
      </>
    )
  },
}

/** 表单抽屉 - 实际使用场景 */
export const FormDrawer: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)

    return (
      <>
        <LMButton variant="primary" onClick={() => setVisible(true)}>
          新建用户
        </LMButton>
        <LMDrawer
          visible={visible}
          title="新建用户"
          width={450}
          onClose={() => setVisible(false)}
          footer={
            <>
              <LMButton variant="outline" onClick={() => setVisible(false)}>取消</LMButton>
              <LMButton variant="primary" onClick={() => setVisible(false)}>提交</LMButton>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--lm-text-primary)',
                  fontWeight: 500,
                }}
              >
                用户名 <span style={{ color: 'var(--lm-error-500)' }}>*</span>
              </label>
              <LMInput placeholder="请输入用户名" />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--lm-text-primary)',
                  fontWeight: 500,
                }}
              >
                邮箱 <span style={{ color: 'var(--lm-error-500)' }}>*</span>
              </label>
              <LMInput type="email" placeholder="请输入邮箱" />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--lm-text-primary)',
                  fontWeight: 500,
                }}
              >
                手机号
              </label>
              <LMInput placeholder="请输入手机号" />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'var(--lm-text-primary)',
                  fontWeight: 500,
                }}
              >
                备注
              </label>
              <LMInput placeholder="请输入备注" />
            </div>
          </div>
        </LMDrawer>
      </>
    )
  },
}
