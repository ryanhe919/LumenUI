/**
 * LMMenu - 菜单组件
 * 为页面和功能提供导航的菜单列表
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMMenu from './LMMenu'
import type { LMMenuItem } from './LMMenu'

/** 主页图标 */
const HomeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

/** 用户图标 */
const UserIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

/** 设置图标 */
const SettingsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

/** 文档图标 */
const DocumentIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

/** 图表图标 */
const ChartIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

/** 邮件图标 */
const MailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

/** 购物车图标 */
const ShoppingCartIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const meta: Meta<typeof LMMenu> = {
  title: '导航 Navigation/LMMenu 菜单',
  component: LMMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '菜单组件，为页面和功能提供导航的菜单列表。支持垂直、水平、内联三种模式，支持收起和展开。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['vertical', 'horizontal', 'inline'],
      description: '菜单模式',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '主题',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '组件尺寸',
    },
    collapsed: {
      control: 'boolean',
      description: '收起状态',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const basicItems: LMMenuItem[] = [
  { key: 'home', label: '首页', icon: <HomeIcon /> },
  { key: 'users', label: '用户管理', icon: <UserIcon /> },
  { key: 'settings', label: '系统设置', icon: <SettingsIcon /> },
]

const nestedItems: LMMenuItem[] = [
  { key: 'home', label: '首页', icon: <HomeIcon /> },
  {
    key: 'users',
    label: '用户管理',
    icon: <UserIcon />,
    children: [
      { key: 'user-list', label: '用户列表' },
      { key: 'user-add', label: '添加用户' },
      { key: 'user-roles', label: '角色管理' },
    ],
  },
  {
    key: 'content',
    label: '内容管理',
    icon: <DocumentIcon />,
    children: [
      { key: 'articles', label: '文章管理' },
      { key: 'categories', label: '分类管理' },
      { key: 'tags', label: '标签管理' },
    ],
  },
  { key: 'analytics', label: '数据分析', icon: <ChartIcon /> },
  { key: 'settings', label: '系统设置', icon: <SettingsIcon /> },
]

/** 默认菜单 - 基础展示 */
export const Default: Story = {
  args: {
    items: basicItems,
    defaultSelectedKeys: ['home'],
  },
  decorators: [
    (Story) => (
      <div style={{ width: '240px' }}>
        <Story />
      </div>
    ),
  ],
}

/** 受控模式 - 可交互 */
export const Controlled: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState(['home'])

    return (
      <div style={{ width: '240px' }}>
        <LMMenu
          items={basicItems}
          selectedKeys={selectedKeys}
          onSelect={(key) => setSelectedKeys([key])}
        />
        <p style={{ marginTop: '16px', color: 'var(--lm-text-secondary)' }}>
          选中: {selectedKeys.join(', ')}
        </p>
      </div>
    )
  },
}

/** 带子菜单 - 嵌套结构 */
export const WithSubMenu: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState(['home'])
    const [openKeys, setOpenKeys] = useState(['users'])

    return (
      <div style={{ width: '240px' }}>
        <LMMenu
          items={nestedItems}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onSelect={(key) => setSelectedKeys([key])}
          onOpenChange={setOpenKeys}
        />
      </div>
    )
  },
}

/** 暗色主题 - 深色背景 */
export const DarkTheme: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState(['home'])
    const [openKeys, setOpenKeys] = useState(['users'])

    return (
      <div style={{ width: '240px', padding: '16px', backgroundColor: 'var(--lm-gray-900)', borderRadius: '12px' }}>
        <LMMenu
          items={nestedItems}
          theme="dark"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onSelect={(key) => setSelectedKeys([key])}
          onOpenChange={setOpenKeys}
        />
      </div>
    )
  },
}

/** 收起模式 - 只显示图标 */
export const Collapsed: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState(['home'])

    return (
      <div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginBottom: '16px',
            padding: '8px 16px',
            backgroundColor: 'var(--lm-primary-500)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          {collapsed ? '展开' : '收起'}
        </button>
        <div style={{ width: collapsed ? '64px' : '240px', transition: 'width 0.2s' }}>
          <LMMenu
            items={basicItems}
            collapsed={collapsed}
            selectedKeys={selectedKeys}
            onSelect={(key) => setSelectedKeys([key])}
          />
        </div>
      </div>
    )
  },
}

/** 带分组 - 分组标题 */
export const WithGroups: Story = {
  args: {
    items: [
      {
        key: 'main-group',
        label: '主要功能',
        type: 'group',
        children: [
          { key: 'home', label: '首页', icon: <HomeIcon /> },
          { key: 'analytics', label: '数据分析', icon: <ChartIcon /> },
        ],
      },
      { key: 'divider1', label: '', type: 'divider' },
      {
        key: 'manage-group',
        label: '管理功能',
        type: 'group',
        children: [
          { key: 'users', label: '用户管理', icon: <UserIcon /> },
          { key: 'settings', label: '系统设置', icon: <SettingsIcon /> },
        ],
      },
    ],
    defaultSelectedKeys: ['home'],
  },
  decorators: [
    (Story) => (
      <div style={{ width: '240px' }}>
        <Story />
      </div>
    ),
  ],
}

/** 禁用选项 - 部分不可用 */
export const WithDisabled: Story = {
  args: {
    items: [
      { key: 'home', label: '首页', icon: <HomeIcon /> },
      { key: 'users', label: '用户管理', icon: <UserIcon />, disabled: true },
      { key: 'settings', label: '系统设置', icon: <SettingsIcon /> },
    ],
    defaultSelectedKeys: ['home'],
  },
  decorators: [
    (Story) => (
      <div style={{ width: '240px' }}>
        <Story />
      </div>
    ),
  ],
}

/** 完整侧边栏 - 实际使用场景 */
export const FullSidebar: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState(['home'])
    const [openKeys, setOpenKeys] = useState<string[]>([])

    const fullItems: LMMenuItem[] = [
      { key: 'home', label: '控制台', icon: <HomeIcon /> },
      { key: 'divider1', label: '', type: 'divider' },
      {
        key: 'users',
        label: '用户中心',
        icon: <UserIcon />,
        children: [
          { key: 'user-list', label: '用户列表' },
          { key: 'user-roles', label: '角色管理' },
          { key: 'user-perms', label: '权限管理' },
        ],
      },
      {
        key: 'content',
        label: '内容管理',
        icon: <DocumentIcon />,
        children: [
          { key: 'articles', label: '文章管理' },
          { key: 'categories', label: '分类管理' },
        ],
      },
      {
        key: 'shop',
        label: '商城管理',
        icon: <ShoppingCartIcon />,
        children: [
          { key: 'products', label: '商品管理' },
          { key: 'orders', label: '订单管理' },
        ],
      },
      { key: 'divider2', label: '', type: 'divider' },
      { key: 'messages', label: '消息通知', icon: <MailIcon /> },
      { key: 'analytics', label: '数据报表', icon: <ChartIcon /> },
      { key: 'settings', label: '系统设置', icon: <SettingsIcon /> },
    ]

    return (
      <div
        style={{
          display: 'flex',
          height: '500px',
          backgroundColor: 'var(--lm-bg-paper)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--lm-border-default)',
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: collapsed ? '64px' : '240px',
            borderRight: '1px solid var(--lm-border-default)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.2s',
          }}
        >
          {/* Logo */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--lm-border-default)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
            }}
          >
            {!collapsed && (
              <span style={{ fontWeight: 'bold', color: 'var(--lm-text-primary)' }}>
                Admin Panel
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                padding: '4px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--lm-text-secondary)',
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Menu */}
          <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
            <LMMenu
              items={fullItems}
              collapsed={collapsed}
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onSelect={(key) => setSelectedKeys([key])}
              onOpenChange={setOpenKeys}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px' }}>
          <h2 style={{ color: 'var(--lm-text-primary)', marginBottom: '16px' }}>
            {selectedKeys[0] || '请选择菜单'}
          </h2>
          <p style={{ color: 'var(--lm-text-secondary)' }}>
            这里是内容区域
          </p>
        </div>
      </div>
    )
  },
}

/** 尺寸对比 - 不同 size */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px' }}>
      <div style={{ width: '180px' }}>
        <h4 style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>SM</h4>
        <LMMenu items={basicItems} size="sm" defaultSelectedKeys={['home']} />
      </div>
      <div style={{ width: '200px' }}>
        <h4 style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>MD（默认）</h4>
        <LMMenu items={basicItems} size="md" defaultSelectedKeys={['home']} />
      </div>
      <div style={{ width: '220px' }}>
        <h4 style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>LG</h4>
        <LMMenu items={basicItems} size="lg" defaultSelectedKeys={['home']} />
      </div>
    </div>
  ),
}
