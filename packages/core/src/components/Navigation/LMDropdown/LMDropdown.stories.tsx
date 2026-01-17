/**
 * LMDropdown - 下拉菜单组件
 * 向下弹出的菜单列表，用于操作菜单、更多操作等场景
 */
import type { Meta, StoryObj } from '@storybook/react'
import LMDropdown from './LMDropdown'
import { LMButton } from '../../General/LMButton'

/** 编辑图标 */
const EditIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

/** 复制图标 */
const CopyIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

/** 删除图标 */
const DeleteIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

/** 下载图标 */
const DownloadIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

/** 分享图标 */
const ShareIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

/** 更多图标 */
const MoreIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
)

/** 向下箭头图标 */
const ChevronDownIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const meta: Meta<typeof LMDropdown> = {
  title: '导航 Navigation/LMDropdown 下拉菜单',
  component: LMDropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '下拉菜单组件，向下弹出的菜单列表。支持点击、悬停、右键触发。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    trigger: {
      control: 'select',
      options: ['click', 'hover', 'contextMenu'],
      description: '触发方式',
    },
    placement: {
      control: 'select',
      options: ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'],
      description: '弹出位置',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '组件尺寸',
    },
    disabled: {
      control: 'boolean',
      description: '禁用状态',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const basicMenu = [
  { key: 'edit', label: '编辑', icon: <EditIcon /> },
  { key: 'copy', label: '复制', icon: <CopyIcon /> },
  { key: 'download', label: '下载', icon: <DownloadIcon /> },
  { key: 'divider', label: '', divider: true },
  { key: 'delete', label: '删除', icon: <DeleteIcon />, danger: true },
]

/** 默认下拉 - 点击触发 */
export const Default: Story = {
  args: {
    menu: basicMenu,
    children: (
      <LMButton variant="outline">
        更多操作 <ChevronDownIcon />
      </LMButton>
    ),
    onSelect: (key: string) => console.log('Selected:', key),
  },
}

/** 悬停触发 - 鼠标悬停显示 */
export const HoverTrigger: Story = {
  args: {
    menu: basicMenu,
    trigger: 'hover',
    children: (
      <LMButton variant="outline">
        悬停显示 <ChevronDownIcon />
      </LMButton>
    ),
  },
}

/** 右键菜单 - 右键触发 */
export const ContextMenu: Story = {
  args: {
    menu: basicMenu,
    trigger: 'contextMenu',
    children: (
      <div
        style={{
          padding: '40px 60px',
          backgroundColor: 'var(--lm-bg-paper)',
          border: '1px dashed var(--lm-border-default)',
          borderRadius: '8px',
          color: 'var(--lm-text-secondary)',
        }}
      >
        右键点击此区域
      </div>
    ),
  },
}

/** 图标按钮 - 更多操作按钮 */
export const IconButton: Story = {
  args: {
    menu: basicMenu,
    children: (
      <button
        style={{
          padding: '8px',
          backgroundColor: 'transparent',
          border: '1px solid var(--lm-border-default)',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--lm-text-primary)',
        }}
      >
        <MoreIcon />
      </button>
    ),
  },
}

/** 带分隔线 - 分组菜单项 */
export const WithDivider: Story = {
  args: {
    menu: [
      { key: 'profile', label: '个人资料' },
      { key: 'settings', label: '设置' },
      { key: 'divider1', label: '', divider: true },
      { key: 'help', label: '帮助中心' },
      { key: 'feedback', label: '问题反馈' },
      { key: 'divider2', label: '', divider: true },
      { key: 'logout', label: '退出登录', danger: true },
    ],
    children: (
      <LMButton variant="outline">
        用户菜单 <ChevronDownIcon />
      </LMButton>
    ),
  },
}

/** 禁用选项 - 部分选项不可用 */
export const WithDisabled: Story = {
  args: {
    menu: [
      { key: 'edit', label: '编辑', icon: <EditIcon /> },
      { key: 'copy', label: '复制', icon: <CopyIcon /> },
      { key: 'share', label: '分享（无权限）', icon: <ShareIcon />, disabled: true },
      { key: 'delete', label: '删除', icon: <DeleteIcon />, danger: true },
    ],
    children: (
      <LMButton variant="outline">
        操作 <ChevronDownIcon />
      </LMButton>
    ),
  },
}

/** 危险操作 - 带警告样式 */
export const DangerItems: Story = {
  args: {
    menu: [
      { key: 'archive', label: '归档' },
      { key: 'disable', label: '禁用', danger: true },
      { key: 'delete', label: '永久删除', icon: <DeleteIcon />, danger: true },
    ],
    children: (
      <LMButton variant="danger">
        危险操作 <ChevronDownIcon />
      </LMButton>
    ),
  },
}

/** 不同位置 - 弹出方向对比 */
export const Placements: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '100px', padding: '50px' }}>
      <LMDropdown menu={basicMenu} placement="bottomLeft">
        <LMButton variant="outline">bottomLeft</LMButton>
      </LMDropdown>
      <LMDropdown menu={basicMenu} placement="bottomRight">
        <LMButton variant="outline">bottomRight</LMButton>
      </LMDropdown>
      <LMDropdown menu={basicMenu} placement="topLeft">
        <LMButton variant="outline">topLeft</LMButton>
      </LMDropdown>
      <LMDropdown menu={basicMenu} placement="topRight">
        <LMButton variant="outline">topRight</LMButton>
      </LMDropdown>
    </div>
  ),
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <LMDropdown menu={basicMenu} size="xs">
        <LMButton size="xs" variant="outline">XS <ChevronDownIcon /></LMButton>
      </LMDropdown>
      <LMDropdown menu={basicMenu} size="sm">
        <LMButton size="sm" variant="outline">SM <ChevronDownIcon /></LMButton>
      </LMDropdown>
      <LMDropdown menu={basicMenu} size="md">
        <LMButton size="md" variant="outline">MD <ChevronDownIcon /></LMButton>
      </LMDropdown>
      <LMDropdown menu={basicMenu} size="lg">
        <LMButton size="lg" variant="outline">LG <ChevronDownIcon /></LMButton>
      </LMDropdown>
    </div>
  ),
}

/** 禁用状态 - 不可交互 */
export const Disabled: Story = {
  args: {
    menu: basicMenu,
    disabled: true,
    children: (
      <LMButton variant="outline" disabled>
        禁用状态 <ChevronDownIcon />
      </LMButton>
    ),
  },
}

/** 表格操作 - 实际使用场景 */
export const InTable: Story = {
  render: () => (
    <div
      style={{
        width: '600px',
        border: '1px solid var(--lm-border-default)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 100px',
          backgroundColor: 'var(--lm-bg-paper)',
          borderBottom: '1px solid var(--lm-border-default)',
          padding: '12px 16px',
          fontWeight: 500,
          color: 'var(--lm-text-secondary)',
        }}
      >
        <span>名称</span>
        <span>状态</span>
        <span>日期</span>
        <span>操作</span>
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 100px',
            padding: '12px 16px',
            borderBottom: i < 3 ? '1px solid var(--lm-border-light)' : 'none',
            color: 'var(--lm-text-primary)',
            alignItems: 'center',
          }}
        >
          <span>项目 {i}</span>
          <span style={{ color: 'var(--lm-success-500)' }}>正常</span>
          <span>2024-01-0{i}</span>
          <LMDropdown
            menu={[
              { key: 'view', label: '查看详情' },
              { key: 'edit', label: '编辑' },
              { key: 'divider', label: '', divider: true },
              { key: 'delete', label: '删除', danger: true },
            ]}
            size="sm"
          >
            <button
              style={{
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--lm-primary-500)',
              }}
            >
              操作
            </button>
          </LMDropdown>
        </div>
      ))}
    </div>
  ),
}

/** 回调示例 - 监听选择事件 */
export const WithCallback: Story = {
  args: {
    menu: [
      { key: 'cut', label: '剪切' },
      { key: 'copy', label: '复制' },
      { key: 'paste', label: '粘贴' },
    ],
    onSelect: (key: string) => alert(`选择了: ${key}`),
    onVisibleChange: (visible: boolean) => console.log('Dropdown visible:', visible),
    children: (
      <LMButton variant="outline">
        选择操作 <ChevronDownIcon />
      </LMButton>
    ),
  },
}
