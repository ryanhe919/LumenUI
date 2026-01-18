/**
 * LMStatCard - 统计卡片组件
 * 用于展示关键指标数据，支持趋势变化和图标
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMStatCard from './LMStatCard'

/** 用户图标 */
const UsersIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

/** 货币图标 */
const DollarIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

/** 图表图标 */
const ChartIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

/** 购物车图标 */
const ShoppingCartIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const meta: Meta<typeof LMStatCard> = {
  title: '数据展示 Data Display/LMStatCard 统计卡片',
  component: LMStatCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '统计卡片组件，用于展示数值指标。支持图标、趋势变化、前后缀和多种样式变体。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
      description: '卡片样式变体',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '卡片尺寸',
    },
    title: {
      description: '指标标题',
    },
    value: {
      description: '指标数值',
    },
    trend: {
      description: '趋势变化百分比',
    },
    trendText: {
      description: '趋势说明文字',
    },
    prefix: {
      description: '数值前缀',
    },
    suffix: {
      description: '数值后缀',
    },
    icon: {
      description: '图标元素',
    },
    clickable: {
      description: '是否可点击',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认卡片 - 基础的统计展示 */
export const Default: Story = {
  args: {
    title: 'Total Users',
    value: '12,345',
  },
}

/** 带图标 - 显示指标图标 */
export const WithIcon: Story = {
  args: {
    title: 'Total Users',
    value: '12,345',
    icon: <UsersIcon />,
  },
}

/** 带趋势 - 显示增长/下降趋势 */
export const WithTrend: Story = {
  args: {
    title: 'Monthly Revenue',
    value: '58,420',
    prefix: '$',
    trend: 12.5,
    trendText: 'vs last month',
    icon: <DollarIcon />,
  },
}

/** 负趋势 - 显示下降趋势 */
export const NegativeTrend: Story = {
  args: {
    title: 'Bounce Rate',
    value: '32.5',
    suffix: '%',
    trend: -8.2,
    trendText: 'vs last week',
  },
}

/** 零趋势 - 无变化 */
export const ZeroTrend: Story = {
  args: {
    title: 'Retention Rate',
    value: '95',
    suffix: '%',
    trend: 0,
    trendText: 'no change',
  },
}

/** 带描述 - 显示额外说明 */
export const WithDescription: Story = {
  args: {
    title: 'Active Sessions',
    value: '1,234',
    description: 'Currently online users',
    icon: <ChartIcon />,
  },
}

/** 可点击 - 支持点击交互 */
export const Clickable: Story = {
  args: {
    title: 'New Orders',
    value: '456',
    icon: <ShoppingCartIcon />,
    clickable: true,
    onClick: () => console.log('Card clicked'),
  },
}

/** 样式变体 - 所有颜色样式 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '800px' }}>
      <LMStatCard title="Default" value="1,234" variant="default" icon={<UsersIcon />} />
      <LMStatCard title="Primary" value="5,678" variant="primary" icon={<UsersIcon />} />
      <LMStatCard title="Success" value="9,012" variant="success" icon={<UsersIcon />} trend={15} />
      <LMStatCard title="Warning" value="3,456" variant="warning" icon={<UsersIcon />} trend={-5} />
      <LMStatCard title="Error" value="7,890" variant="error" icon={<UsersIcon />} trend={-12} />
      <LMStatCard title="Info" value="2,345" variant="info" icon={<UsersIcon />} />
    </div>
  ),
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <LMStatCard title="XS Size" value="1,234" size="xs" icon={<UsersIcon />} />
      <LMStatCard title="SM Size" value="1,234" size="sm" icon={<UsersIcon />} />
      <LMStatCard title="MD Size" value="1,234" size="md" icon={<UsersIcon />} />
      <LMStatCard title="LG Size" value="1,234" size="lg" icon={<UsersIcon />} />
      <LMStatCard title="XL Size" value="1,234" size="xl" icon={<UsersIcon />} />
    </div>
  ),
}

/** 紧凑模式 - 适合密集布局 */
export const CompactMode: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', width: '600px' }}>
      <LMStatCard title="Users" value="1.2K" compact />
      <LMStatCard title="Revenue" value="$45K" compact />
      <LMStatCard title="Orders" value="892" compact />
      <LMStatCard title="Growth" value="23%" compact trend={23} />
    </div>
  ),
}

/** 前后缀 - 货币和单位 */
export const WithPrefixSuffix: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '500px' }}>
      <LMStatCard title="Revenue" value="125,430" prefix="$" icon={<DollarIcon />} />
      <LMStatCard title="Conversion" value="12.5" suffix="%" icon={<ChartIcon />} />
      <LMStatCard title="Temperature" value="72" suffix="°F" />
      <LMStatCard title="Balance" value="5,000" prefix="$" suffix="USD" />
    </div>
  ),
}

/** 仪表板示例 - 完整的数据看板 */
export const Dashboard: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', width: '900px' }}>
      <LMStatCard
        title="Total Users"
        value="12,345"
        icon={<UsersIcon />}
        trend={12.5}
        trendText="vs last month"
        variant="primary"
      />
      <LMStatCard
        title="Revenue"
        value="58,420"
        prefix="$"
        icon={<DollarIcon />}
        trend={8.2}
        trendText="vs last month"
        variant="success"
      />
      <LMStatCard
        title="Orders"
        value="1,456"
        icon={<ShoppingCartIcon />}
        trend={-3.1}
        trendText="vs last week"
        variant="warning"
      />
      <LMStatCard
        title="Conversion"
        value="3.2"
        suffix="%"
        icon={<ChartIcon />}
        trend={0.5}
        trendText="vs last week"
        variant="info"
      />
    </div>
  ),
}

/** 无边框无阴影 - 极简样式 */
export const NoBorderNoShadow: Story = {
  args: {
    title: 'Minimal Card',
    value: '1,234',
    bordered: false,
    shadow: false,
  },
}

/** 可点击卡片组 - 交互式数据卡片 */
export const ClickableCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '700px' }}>
      <LMStatCard
        title="Users"
        value="12,345"
        icon={<UsersIcon />}
        clickable
        onClick={() => console.log('Users clicked')}
        variant="primary"
      />
      <LMStatCard
        title="Revenue"
        value="$58,420"
        icon={<DollarIcon />}
        clickable
        onClick={() => console.log('Revenue clicked')}
        variant="success"
      />
      <LMStatCard
        title="Orders"
        value="1,456"
        icon={<ShoppingCartIcon />}
        clickable
        onClick={() => console.log('Orders clicked')}
        variant="info"
      />
    </div>
  ),
}
