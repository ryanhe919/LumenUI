/**
 * LMCard - 卡片组件
 * 通用容器组件，用于信息分组展示
 */
import type { Meta, StoryObj } from '@storybook/react'
import LMCard from './LMCard'
import { LMButton } from '../../General/LMButton'

/** 设置图标 */
const SettingsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

/** 编辑图标 */
const EditIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

/** 删除图标 */
const DeleteIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

/** 分享图标 */
const ShareIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

const meta: Meta<typeof LMCard> = {
  title: '数据展示 Data Display/LMCard 卡片',
  component: LMCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '通用卡片容器组件，用于信息分组展示。支持标题、操作区、封面图、底部操作栏等多种布局。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outline', 'soft'],
      description: '卡片样式变体',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '卡片尺寸',
    },
    bordered: {
      control: 'boolean',
      description: '是否显示边框',
    },
    hoverable: {
      control: 'boolean',
      description: '是否有悬停效果',
    },
    loading: {
      control: 'boolean',
      description: '是否显示加载骨架屏',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认卡片 - 基础展示 */
export const Default: Story = {
  args: {
    children: (
      <div>
        <p style={{ color: 'var(--lm-text-primary)' }}>这是一个基础卡片，用于展示内容。</p>
        <p style={{ color: 'var(--lm-text-secondary)', marginTop: '8px' }}>卡片可以包含任意内容。</p>
      </div>
    ),
  },
}

/** 带标题 - 显示标题和操作区 */
export const WithTitle: Story = {
  args: {
    title: '卡片标题',
    children: (
      <p style={{ color: 'var(--lm-text-primary)' }}>带有标题的卡片内容区域。</p>
    ),
  },
}

/** 标题和操作区 - 完整头部 */
export const WithTitleAndExtra: Story = {
  args: {
    title: '用户信息',
    extra: <a href="#" style={{ color: 'var(--lm-primary-500)' }}>更多</a>,
    children: (
      <div>
        <p style={{ color: 'var(--lm-text-primary)' }}>用户名：张三</p>
        <p style={{ color: 'var(--lm-text-secondary)', marginTop: '4px' }}>邮箱：zhangsan@example.com</p>
      </div>
    ),
  },
}

/** 带封面 - 顶部图片 */
export const WithCover: Story = {
  args: {
    cover: (
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
        alt="Cover"
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
    ),
    title: '风景照片',
    children: (
      <p style={{ color: 'var(--lm-text-secondary)' }}>这是一张美丽的风景照片，拍摄于阿尔卑斯山。</p>
    ),
  },
}

/** 带操作栏 - 底部按钮 */
export const WithActions: Story = {
  args: {
    title: '操作卡片',
    actions: [
      <span key="edit" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <EditIcon /> 编辑
      </span>,
      <span key="delete" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <DeleteIcon /> 删除
      </span>,
      <span key="share" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <ShareIcon /> 分享
      </span>,
    ],
    children: (
      <p style={{ color: 'var(--lm-text-primary)' }}>这个卡片底部有操作按钮。</p>
    ),
  },
}

/** 可悬停 - 交互效果 */
export const Hoverable: Story = {
  args: {
    title: '可悬停卡片',
    hoverable: true,
    children: (
      <p style={{ color: 'var(--lm-text-primary)' }}>将鼠标悬停在卡片上查看效果。</p>
    ),
  },
}

/** 加载状态 - 骨架屏 */
export const Loading: Story = {
  args: {
    title: '加载中',
    loading: true,
    children: (
      <p>这段内容不会显示</p>
    ),
  },
}

/** 样式变体 - 所有变体对比 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '600px' }}>
      <LMCard title="Default" variant="default">
        <p style={{ color: 'var(--lm-text-secondary)' }}>默认样式，带阴影和边框</p>
      </LMCard>
      <LMCard title="Elevated" variant="elevated">
        <p style={{ color: 'var(--lm-text-secondary)' }}>高架样式，更强的阴影</p>
      </LMCard>
      <LMCard title="Outline" variant="outline">
        <p style={{ color: 'var(--lm-text-secondary)' }}>轮廓样式，透明背景</p>
      </LMCard>
      <LMCard title="Soft" variant="soft">
        <p style={{ color: 'var(--lm-text-secondary)' }}>柔和样式，浅色背景</p>
      </LMCard>
    </div>
  ),
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '400px' }}>
      <LMCard title="XS 尺寸" size="xs">
        <p style={{ color: 'var(--lm-text-secondary)' }}>超小尺寸卡片</p>
      </LMCard>
      <LMCard title="SM 尺寸" size="sm">
        <p style={{ color: 'var(--lm-text-secondary)' }}>小尺寸卡片</p>
      </LMCard>
      <LMCard title="MD 尺寸" size="md">
        <p style={{ color: 'var(--lm-text-secondary)' }}>中等尺寸卡片（默认）</p>
      </LMCard>
      <LMCard title="LG 尺寸" size="lg">
        <p style={{ color: 'var(--lm-text-secondary)' }}>大尺寸卡片</p>
      </LMCard>
    </div>
  ),
}

/** 无边框 - 极简样式 */
export const NoBorder: Story = {
  args: {
    title: '无边框卡片',
    bordered: false,
    children: (
      <p style={{ color: 'var(--lm-text-secondary)' }}>这个卡片没有边框。</p>
    ),
  },
}

/** 完整示例 - 商品卡片 */
export const ProductCard: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <LMCard
        cover={
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop"
            alt="Product"
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        }
        hoverable
        actions={[
          <span key="price" style={{ fontWeight: 'bold', color: 'var(--lm-error-500)' }}>$99.00</span>,
          <LMButton key="buy" size="sm" variant="primary">购买</LMButton>,
        ]}
      >
        <h3 style={{ color: 'var(--lm-text-primary)', margin: '0 0 8px 0' }}>智能手表</h3>
        <p style={{ color: 'var(--lm-text-secondary)', fontSize: '14px', margin: 0 }}>
          高清显示屏，支持心率监测、GPS定位
        </p>
      </LMCard>
    </div>
  ),
}

/** 用户卡片 - 个人信息展示 */
export const UserCard: Story = {
  render: () => (
    <div style={{ width: '350px' }}>
      <LMCard
        title="个人信息"
        extra={<SettingsIcon />}
        variant="soft"
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--lm-primary-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--lm-primary-600)',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            张
          </div>
          <div>
            <h4 style={{ color: 'var(--lm-text-primary)', margin: '0 0 4px 0' }}>张三</h4>
            <p style={{ color: 'var(--lm-text-secondary)', fontSize: '14px', margin: '0 0 4px 0' }}>
              前端开发工程师
            </p>
            <p style={{ color: 'var(--lm-text-tertiary)', fontSize: '12px', margin: 0 }}>
              北京市朝阳区
            </p>
          </div>
        </div>
      </LMCard>
    </div>
  ),
}

/** 卡片组 - Dashboard 布局 */
export const CardGroup: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '900px' }}>
      <LMCard title="今日访问" hoverable>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--lm-primary-500)' }}>1,234</div>
        <p style={{ color: 'var(--lm-text-secondary)', marginTop: '8px' }}>较昨日增长 12%</p>
      </LMCard>
      <LMCard title="活跃用户" hoverable>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--lm-success-500)' }}>5,678</div>
        <p style={{ color: 'var(--lm-text-secondary)', marginTop: '8px' }}>本周新增 234</p>
      </LMCard>
      <LMCard title="订单数量" hoverable>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--lm-warning-500)' }}>892</div>
        <p style={{ color: 'var(--lm-text-secondary)', marginTop: '8px' }}>待处理 45</p>
      </LMCard>
    </div>
  ),
}
