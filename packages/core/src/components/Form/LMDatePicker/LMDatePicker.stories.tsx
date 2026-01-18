/**
 * LMDatePicker - 日期选择器组件
 * 输入或选择日期的控件
 */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import LMDatePicker from './LMDatePicker'

const meta: Meta<typeof LMDatePicker> = {
  title: '表单 Form/LMDatePicker 日期选择器',
  component: LMDatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '日期选择器组件，用于输入或选择日期。支持禁用日期、自定义格式等功能。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '组件尺寸',
    },
    format: {
      control: 'text',
      description: '日期格式',
    },
    placeholder: {
      control: 'text',
      description: '占位文本',
    },
    disabled: {
      control: 'boolean',
      description: '禁用状态',
    },
    allowClear: {
      control: 'boolean',
      description: '允许清除',
    },
    error: {
      control: 'boolean',
      description: '错误状态',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认选择器 - 基础展示 */
export const Default: Story = {
  args: {
    placeholder: '请选择日期',
  },
}

/** 受控模式 - 可交互 */
export const Controlled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)

    return (
      <div>
        <LMDatePicker
          value={date}
          onChange={(d, dateString) => {
            setDate(d)
            console.log('Selected:', dateString)
          }}
        />
        <p style={{ marginTop: '16px', color: 'var(--lm-text-secondary)' }}>
          选中日期: {date ? date.toLocaleDateString() : '无'}
        </p>
      </div>
    )
  },
}

/** 默认值 - 预设日期 */
export const WithDefaultValue: Story = {
  args: {
    defaultValue: new Date(),
  },
}

/** 自定义格式 - 不同日期格式 */
export const CustomFormat: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date())

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>YYYY-MM-DD</p>
          <LMDatePicker value={date} format="YYYY-MM-DD" onChange={setDate} />
        </div>
        <div>
          <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>YYYY/MM/DD</p>
          <LMDatePicker value={date} format="YYYY/MM/DD" onChange={(d) => setDate(d)} />
        </div>
        <div>
          <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>MM-DD-YYYY</p>
          <LMDatePicker value={date} format="MM-DD-YYYY" onChange={(d) => setDate(d)} />
        </div>
      </div>
    )
  },
}

/** 禁用状态 - 不可交互 */
export const Disabled: Story = {
  args: {
    defaultValue: new Date(),
    disabled: true,
  },
}

/** 禁用日期 - 部分日期不可选 */
export const DisabledDates: Story = {
  render: () => {
    const today = new Date()

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>禁用过去的日期</p>
          <LMDatePicker
            disabledDate={(date) => date < new Date(today.setHours(0, 0, 0, 0))}
            placeholder="只能选择今天及以后"
          />
        </div>
        <div>
          <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>禁用周末</p>
          <LMDatePicker
            disabledDate={(date) => date.getDay() === 0 || date.getDay() === 6}
            placeholder="不能选择周末"
          />
        </div>
      </div>
    )
  },
}

/** 错误状态 - 验证失败 */
export const WithError: Story = {
  args: {
    error: true,
    errorMessage: '请选择有效的日期',
  },
}

/** 不允许清除 - 必填场景 */
export const NoClear: Story = {
  args: {
    defaultValue: new Date(),
    allowClear: false,
  },
}

/** 尺寸展示 - 所有可用尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>XS</p>
        <LMDatePicker size="xs" defaultValue={new Date()} />
      </div>
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>SM</p>
        <LMDatePicker size="sm" defaultValue={new Date()} />
      </div>
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>MD（默认）</p>
        <LMDatePicker size="md" defaultValue={new Date()} />
      </div>
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>LG</p>
        <LMDatePicker size="lg" defaultValue={new Date()} />
      </div>
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>XL</p>
        <LMDatePicker size="xl" defaultValue={new Date()} />
      </div>
    </div>
  ),
}

/** 表单场景 - 实际使用 */
export const InForm: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    return (
      <div
        style={{
          width: '400px',
          padding: '24px',
          backgroundColor: 'var(--lm-bg-elevated)',
          borderRadius: '12px',
          border: '1px solid var(--lm-border-default)',
        }}
      >
        <h3 style={{ color: 'var(--lm-text-primary)', marginBottom: '24px' }}>日期筛选</h3>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--lm-text-primary)',
              fontWeight: 500,
            }}
          >
            开始日期
          </label>
          <LMDatePicker
            value={startDate}
            onChange={(d) => setStartDate(d)}
            placeholder="选择开始日期"
            disabledDate={(date) => (endDate ? date > endDate : false)}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              color: 'var(--lm-text-primary)',
              fontWeight: 500,
            }}
          >
            结束日期
          </label>
          <LMDatePicker
            value={endDate}
            onChange={(d) => setEndDate(d)}
            placeholder="选择结束日期"
            disabledDate={(date) => (startDate ? date < startDate : false)}
          />
        </div>

        <div style={{ color: 'var(--lm-text-secondary)', fontSize: '14px' }}>
          <p>开始: {startDate?.toLocaleDateString() || '未选择'}</p>
          <p>结束: {endDate?.toLocaleDateString() || '未选择'}</p>
        </div>
      </div>
    )
  },
}

/** 字符串值 - 传入字符串 */
export const StringValue: Story = {
  render: () => {
    const [date, setDate] = useState<string>('2024-06-15')

    return (
      <div>
        <LMDatePicker
          value={date}
          onChange={(_d, dateString) => setDate(dateString)}
        />
        <p style={{ marginTop: '16px', color: 'var(--lm-text-secondary)' }}>
          字符串值: {date}
        </p>
      </div>
    )
  },
}

/** 自定义占位符 - 不同提示文本 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: '点击选择出生日期',
  },
}

/** 日期时间选择器 - 同时选择日期和时间 */
export const DateTimePicker: Story = {
  render: () => {
    const [dateTime, setDateTime] = useState<Date | null>(null)

    return (
      <div>
        <LMDatePicker
          showTime
          value={dateTime}
          onChange={(d, dateString) => {
            setDateTime(d)
            console.log('Selected:', dateString)
          }}
          placeholder="请选择日期和时间"
        />
        <p style={{ marginTop: '16px', color: 'var(--lm-text-secondary)' }}>
          选中时间: {dateTime ? dateTime.toLocaleString() : '无'}
        </p>
      </div>
    )
  },
}

/** 带默认时间的日期时间选择器 */
export const DateTimeWithDefault: Story = {
  args: {
    showTime: true,
    defaultValue: new Date(),
  },
}

/** 自定义时间步长 - 分钟按15分钟递增 */
export const CustomTimeStep: Story = {
  render: () => {
    const [dateTime, setDateTime] = useState<Date | null>(null)

    return (
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>
          分钟步长: 15, 秒步长: 30
        </p>
        <LMDatePicker
          showTime={{
            minuteStep: 15,
            secondStep: 30,
          }}
          value={dateTime}
          onChange={(d) => setDateTime(d)}
          placeholder="选择日期和时间"
        />
      </div>
    )
  },
}

/** 只显示时分 - 隐藏秒选择 */
export const HourMinuteOnly: Story = {
  render: () => {
    const [dateTime, setDateTime] = useState<Date | null>(null)

    return (
      <div>
        <LMDatePicker
          showTime={{
            showSecond: false,
          }}
          format="YYYY-MM-DD HH:mm"
          value={dateTime}
          onChange={(d) => setDateTime(d)}
          placeholder="选择日期和时间"
        />
      </div>
    )
  },
}

/** 时间选择器与禁用日期结合 */
export const DateTimeWithDisabled: Story = {
  render: () => {
    const [dateTime, setDateTime] = useState<Date | null>(null)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return (
      <div>
        <p style={{ color: 'var(--lm-text-secondary)', marginBottom: '8px' }}>
          只能选择今天及以后的日期时间
        </p>
        <LMDatePicker
          showTime
          value={dateTime}
          onChange={(d) => setDateTime(d)}
          disabledDate={(date) => date < today}
          placeholder="选择日期和时间"
        />
      </div>
    )
  },
}
