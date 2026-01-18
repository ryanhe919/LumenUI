/**
 * LMTabs - 标签页组件
 * 用于在同一页面内切换不同的内容区域
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMTabs from './LMTabs'
import { LMButton } from '../../General/LMButton'

/** 主页图标 */
const HomeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

/** 用户图标 */
const UserIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

/** 设置图标 */
const SettingsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

/** 消息图标 */
const MessageIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const meta: Meta<typeof LMTabs> = {
  title: '数据展示 Data Display/LMTabs 标签页',
  component: LMTabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '标签页组件，用于在同一页面内切换不同的内容区域。支持线条、卡片、圆角三种样式。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'card', 'rounded'],
      description: '标签页样式',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '组件尺寸',
    },
    centered: {
      control: 'boolean',
      description: '标签居中',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const basicItems = [
  { key: 'tab1', label: '标签一', children: <div style={{ padding: '16px', color: 'var(--lm-text-primary)' }}>标签一的内容</div> },
  { key: 'tab2', label: '标签二', children: <div style={{ padding: '16px', color: 'var(--lm-text-primary)' }}>标签二的内容</div> },
  { key: 'tab3', label: '标签三', children: <div style={{ padding: '16px', color: 'var(--lm-text-primary)' }}>标签三的内容</div> },
]

/** 默认标签页 - 线条样式 */
export const Default: Story = {
  args: {
    items: basicItems,
    defaultActiveKey: 'tab1',
  },
}

/** 受控模式 - 可交互 */
export const Controlled: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('tab1')

    return (
      <div>
        <LMTabs
          items={basicItems}
          activeKey={activeKey}
          onChange={setActiveKey}
        />
        <p style={{ marginTop: '16px', color: 'var(--lm-text-secondary)' }}>
          当前激活: {activeKey}
        </p>
      </div>
    )
  },
}

/** 卡片样式 - card 类型 */
export const CardType: Story = {
  args: {
    items: basicItems,
    type: 'card',
    defaultActiveKey: 'tab1',
  },
}

/** 圆角样式 - rounded 类型 */
export const RoundedType: Story = {
  args: {
    items: basicItems,
    type: 'rounded',
    defaultActiveKey: 'tab1',
  },
}

/** 带图标 - 标签带图标 */
export const WithIcons: Story = {
  args: {
    items: [
      { key: 'home', label: '首页', icon: <HomeIcon />, children: <div style={{ padding: '16px', color: 'var(--lm-text-primary)' }}>首页内容</div> },
      { key: 'user', label: '用户', icon: <UserIcon />, children: <div style={{ padding: '16px', color: 'var(--lm-text-primary)' }}>用户内容</div> },
      { key: 'settings', label: '设置', icon: <SettingsIcon />, children: <div style={{ padding: '16px', color: 'var(--lm-text-primary)' }}>设置内容</div> },
    ],
    defaultActiveKey: 'home',
  },
}

/** 禁用标签 - 部分标签不可用 */
export const WithDisabled: Story = {
  args: {
    items: [
      { key: 'tab1', label: '可用标签', children: <div style={{ padding: '16px', color: 'var(--lm-text-primary)' }}>可用内容</div> },
      { key: 'tab2', label: '禁用标签', disabled: true, children: <div style={{ padding: '16px', color: 'var(--lm-text-primary)' }}>禁用内容</div> },
      { key: 'tab3', label: '另一个可用', children: <div style={{ padding: '16px', color: 'var(--lm-text-primary)' }}>另一个内容</div> },
    ],
    defaultActiveKey: 'tab1',
  },
}

/** 居中显示 - 标签居中对齐 */
export const Centered: Story = {
  args: {
    items: basicItems,
    centered: true,
    defaultActiveKey: 'tab1',
  },
}

/** 带额外内容 - 右侧操作区 */
export const WithExtra: Story = {
  args: {
    items: basicItems,
    defaultActiveKey: 'tab1',
    tabBarExtraContent: (
      <LMButton size="sm" variant="primary">
        新建
      </LMButton>
    ),
  },
}

/** 样式对比 - 三种类型对比 */
export const TypeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <h4 style={{ color: 'var(--lm-text-secondary)', marginBottom: '16px' }}>Line 类型</h4>
        <LMTabs items={basicItems} type="line" defaultActiveKey="tab1" />
      </div>
      <div>
        <h4 style={{ color: 'var(--lm-text-secondary)', marginBottom: '16px' }}>Card 类型</h4>
        <LMTabs items={basicItems} type="card" defaultActiveKey="tab1" />
      </div>
      <div>
        <h4 style={{ color: 'var(--lm-text-secondary)', marginBottom: '16px' }}>Rounded 类型</h4>
        <LMTabs items={basicItems} type="rounded" defaultActiveKey="tab1" />
      </div>
    </div>
  ),
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>XS</h4>
        <LMTabs items={basicItems} size="xs" defaultActiveKey="tab1" />
      </div>
      <div>
        <h4 style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>SM</h4>
        <LMTabs items={basicItems} size="sm" defaultActiveKey="tab1" />
      </div>
      <div>
        <h4 style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>MD（默认）</h4>
        <LMTabs items={basicItems} size="md" defaultActiveKey="tab1" />
      </div>
      <div>
        <h4 style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>LG</h4>
        <LMTabs items={basicItems} size="lg" defaultActiveKey="tab1" />
      </div>
    </div>
  ),
}

/** 无内容 - 仅标签导航 */
export const TabsOnly: Story = {
  render: () => {
    const [activeKey, setActiveKey] = useState('overview')

    return (
      <div>
        <LMTabs
          items={[
            { key: 'overview', label: '概览' },
            { key: 'analytics', label: '分析' },
            { key: 'reports', label: '报告' },
            { key: 'notifications', label: '通知' },
          ]}
          activeKey={activeKey}
          onChange={setActiveKey}
        />
        <div
          style={{
            marginTop: '24px',
            padding: '32px',
            backgroundColor: 'var(--lm-bg-paper)',
            borderRadius: '12px',
            color: 'var(--lm-text-primary)',
          }}
        >
          当前页面: {activeKey}
        </div>
      </div>
    )
  },
}

/** 卡片内使用 - 实际场景 */
export const InCard: Story = {
  render: () => (
    <div
      style={{
        width: '600px',
        backgroundColor: 'var(--lm-bg-elevated)',
        border: '1px solid var(--lm-border-default)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--lm-border-default)',
        }}
      >
        <h3 style={{ margin: 0, color: 'var(--lm-text-primary)' }}>用户详情</h3>
      </div>
      <div style={{ padding: '0 24px' }}>
        <LMTabs
          items={[
            {
              key: 'profile',
              label: '基本信息',
              icon: <UserIcon />,
              children: (
                <div style={{ padding: '16px 0', color: 'var(--lm-text-primary)' }}>
                  <p>姓名：张三</p>
                  <p>邮箱：zhangsan@example.com</p>
                  <p>手机：138****8888</p>
                </div>
              ),
            },
            {
              key: 'messages',
              label: '消息',
              icon: <MessageIcon />,
              children: (
                <div style={{ padding: '16px 0', color: 'var(--lm-text-secondary)' }}>
                  暂无消息
                </div>
              ),
            },
            {
              key: 'settings',
              label: '设置',
              icon: <SettingsIcon />,
              children: (
                <div style={{ padding: '16px 0', color: 'var(--lm-text-primary)' }}>
                  <p>语言：简体中文</p>
                  <p>时区：GMT+8</p>
                </div>
              ),
            },
          ]}
          defaultActiveKey="profile"
        />
      </div>
    </div>
  ),
}

/** 多标签 - 大量标签 */
export const ManyTabs: Story = {
  args: {
    items: Array.from({ length: 8 }, (_, i) => ({
      key: `tab${i + 1}`,
      label: `标签 ${i + 1}`,
      children: <div style={{ padding: '16px', color: 'var(--lm-text-primary)' }}>标签 {i + 1} 的内容</div>,
    })),
    defaultActiveKey: 'tab1',
  },
}

/** 回调示例 - 监听事件 */
export const WithCallbacks: Story = {
  args: {
    items: basicItems,
    defaultActiveKey: 'tab1',
    onChange: (key: string) => console.log('Tab changed to:', key),
    onTabClick: (key: string) => console.log('Tab clicked:', key),
  },
}
