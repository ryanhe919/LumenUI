/**
 * LMField - 表单字段组件
 * 用于包装表单控件，提供标签、必填标记、帮助文字和错误提示
 */
import type { Meta, StoryObj } from '@storybook/react'
import LMField from './LMField'
import LMInput from '../LMInput/LMInput'
import LMSelect from '../LMSelect/LMSelect'
import LMTextarea from '../LMTextarea/LMTextarea'

const meta: Meta<typeof LMField> = {
  title: '表单 Form/LMField 表单字段',
  component: LMField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '表单字段容器组件，用于统一管理表单控件的标签、必填标记、帮助文字和错误信息。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: '字段标签',
    },
    required: {
      description: '是否必填',
    },
    help: {
      description: '帮助提示文字',
    },
    errorMessage: {
      description: '错误提示信息',
    },
    children: {
      description: '表单控件元素',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认字段 - 基础的带标签输入框 */
export const Default: Story = {
  args: {
    label: 'Email',
    children: <LMInput placeholder="Enter your email" />,
  },
}

/** 必填字段 - 显示必填标记 */
export const Required: Story = {
  args: {
    label: 'Username',
    required: true,
    children: <LMInput placeholder="Enter username" />,
  },
}

/** 带帮助文字 - 显示输入提示 */
export const WithHelp: Story = {
  args: {
    label: 'Password',
    required: true,
    help: 'Must be at least 8 characters with one uppercase letter',
    children: <LMInput type="password" placeholder="Enter password" />,
  },
}

/** 带错误信息 - 显示校验错误 */
export const WithError: Story = {
  args: {
    label: 'Email',
    required: true,
    errorMessage: 'Please enter a valid email address',
    children: <LMInput type="email" placeholder="Enter email" error />,
  },
}

/** 配合下拉框 - 使用 Select 控件 */
export const WithSelect: Story = {
  args: {
    label: 'Country',
    required: true,
    children: (
      <LMSelect
        options={[
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'ca', label: 'Canada' },
          { value: 'au', label: 'Australia' },
        ]}
        placeholder="Select a country"
      />
    ),
  },
}

/** 配合文本域 - 使用 Textarea 控件 */
export const WithTextarea: Story = {
  args: {
    label: 'Bio',
    help: 'Write a short description about yourself',
    children: <LMTextarea placeholder="Tell us about yourself..." rows={4} />,
  },
}

/** 表单示例 - 完整的表单布局 */
export const FormExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <LMField label="Full Name" required>
        <LMInput placeholder="John Doe" />
      </LMField>
      <LMField label="Email" required>
        <LMInput type="email" placeholder="john@example.com" />
      </LMField>
      <LMField label="Role">
        <LMSelect
          options={[
            { value: 'developer', label: 'Developer' },
            { value: 'designer', label: 'Designer' },
            { value: 'manager', label: 'Manager' },
          ]}
          placeholder="Select a role"
        />
      </LMField>
      <LMField label="Message" help="Optional">
        <LMTextarea placeholder="Any additional information..." rows={3} />
      </LMField>
    </div>
  ),
}

/** 所有状态 - 展示字段的各种状态 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <LMField label="Default Field">
        <LMInput placeholder="Default input" />
      </LMField>
      <LMField label="Required Field" required>
        <LMInput placeholder="Required input" />
      </LMField>
      <LMField label="With Help Text" help="This is helpful information">
        <LMInput placeholder="Input with help" />
      </LMField>
      <LMField label="With Error" errorMessage="This field has an error">
        <LMInput placeholder="Error input" error />
      </LMField>
    </div>
  ),
}
