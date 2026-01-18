/**
 * LMUpload - 文件上传组件
 * 用于上传文件到服务器的交互组件
 */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import LMUpload from './LMUpload'
import type { LMUploadFile } from './LMUpload'

const meta: Meta<typeof LMUpload> = {
  title: '表单 Form/LMUpload 文件上传',
  component: LMUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '文件上传组件，支持拖拽上传、多文件上传、文件类型限制、上传进度显示等功能。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    accept: {
      control: 'text',
      description: '接受的文件类型，如 "image/*,.pdf"',
    },
    multiple: {
      control: 'boolean',
      description: '是否允许多选文件',
    },
    maxCount: {
      control: 'number',
      description: '最大文件数量',
    },
    maxSize: {
      control: 'number',
      description: '最大文件大小（字节）',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    showFileList: {
      control: 'boolean',
      description: '是否显示文件列表',
    },
    listType: {
      control: 'select',
      options: ['text', 'picture'],
      description: '文件列表样式',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: '组件尺寸',
    },
    error: {
      control: 'boolean',
      description: '是否显示错误状态',
    },
    placeholder: {
      control: 'text',
      description: '占位文字',
    },
    hint: {
      control: 'text',
      description: '提示文字',
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

/** 基础用法 - 点击或拖拽上传文件 */
export const Basic: Story = {
  args: {
    placeholder: '点击或拖拽文件到此区域上传',
    hint: '支持单个文件上传',
  },
}

/** 多文件上传 - 允许选择多个文件 */
export const Multiple: Story = {
  args: {
    multiple: true,
    placeholder: '点击或拖拽文件到此区域上传',
    hint: '支持多文件上传',
  },
}

/** 图片上传 - 仅接受图片文件 */
export const ImageOnly: Story = {
  args: {
    accept: 'image/*',
    multiple: true,
    listType: 'picture',
    placeholder: '点击或拖拽图片到此区域',
    hint: '支持 JPG、PNG、GIF 格式',
  },
}

/** 带文件列表 - 展示已上传的文件 */
export const WithFileList: Story = {
  args: {
    defaultFileList: [
      { uid: '1', name: '合同文档.pdf', size: 102400, type: 'application/pdf', status: 'done' },
      { uid: '2', name: '产品图片.jpg', size: 204800, type: 'image/jpeg', status: 'done' },
    ],
    multiple: true,
    hint: '支持 PDF、图片等格式',
  },
}

/** 图片预览列表 - 以缩略图形式展示图片 */
export const PictureList: Story = {
  args: {
    defaultFileList: [
      { uid: '1', name: 'photo1.jpg', size: 102400, type: 'image/jpeg', status: 'done', url: 'https://picsum.photos/200/200?random=1' },
      { uid: '2', name: 'photo2.png', size: 204800, type: 'image/png', status: 'done', url: 'https://picsum.photos/200/200?random=2' },
    ],
    accept: 'image/*',
    multiple: true,
    listType: 'picture',
    placeholder: '点击上传图片',
    hint: '支持 JPG、PNG 格式',
  },
}

/** 上传中状态 - 显示上传进度 */
export const Uploading: Story = {
  args: {
    defaultFileList: [
      { uid: '1', name: '大文件.zip', size: 10485760, type: 'application/zip', status: 'uploading', percent: 45 },
      { uid: '2', name: '文档.pdf', size: 204800, type: 'application/pdf', status: 'done' },
    ],
    multiple: true,
  },
}

/** 上传失败 - 显示错误状态 */
export const UploadError: Story = {
  args: {
    defaultFileList: [
      { uid: '1', name: '损坏文件.pdf', size: 102400, type: 'application/pdf', status: 'error', error: '文件上传失败' },
      { uid: '2', name: '正常文件.pdf', size: 204800, type: 'application/pdf', status: 'done' },
    ],
    multiple: true,
  },
}

/** 禁用状态 - 不可交互 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '上传功能已禁用',
  },
}

/** 错误状态 - 表单验证失败 */
export const Error: Story = {
  args: {
    error: true,
    errorMessage: '请上传至少一个文件',
    placeholder: '点击或拖拽文件到此区域上传',
  },
}

/** 限制文件数量 - 最多上传3个文件 */
export const MaxCount: Story = {
  args: {
    multiple: true,
    maxCount: 3,
    placeholder: '点击或拖拽文件到此区域',
    hint: '最多上传 3 个文件',
  },
}

/** 限制文件大小 - 单个文件不超过2MB */
export const MaxSize: Story = {
  args: {
    maxSize: 2 * 1024 * 1024,
    placeholder: '点击或拖拽文件到此区域',
    hint: '单个文件不超过 2MB',
  },
}

/** 自定义触发器 - 使用按钮触发上传 */
export const CustomTrigger: Story = {
  render: () => (
    <LMUpload multiple>
      <button
        className="px-4 py-2 rounded-xl font-medium transition-all duration-200"
        style={{
          backgroundColor: 'var(--lm-primary-500)',
          color: 'white',
        }}
      >
        选择文件
      </button>
    </LMUpload>
  ),
}

/** 受控组件 - 完全控制文件列表 */
export const Controlled: Story = {
  render: () => {
    const [fileList, setFileList] = useState<LMUploadFile[]>([
      { uid: '1', name: 'example.pdf', size: 102400, type: 'application/pdf', status: 'done' },
    ])

    return (
      <div>
        <LMUpload
          fileList={fileList}
          onChange={setFileList}
          multiple
          placeholder="点击或拖拽文件到此区域"
        />
        <p className="mt-4 text-sm" style={{ color: 'var(--lm-text-secondary)' }}>
          当前文件数: {fileList.length}
        </p>
      </div>
    )
  },
}

/** 自定义上传 - 模拟上传到服务器 */
export const CustomUpload: Story = {
  render: () => {
    const customRequest = async (file: File): Promise<string> => {
      // 模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 2000))
      return `https://example.com/files/${file.name}`
    }

    return (
      <LMUpload
        customRequest={customRequest}
        multiple
        placeholder="点击或拖拽文件到此区域"
        hint="文件将上传到服务器"
      />
    )
  },
}

/** 上传前校验 - 校验文件类型和大小 */
export const BeforeUpload: Story = {
  render: () => {
    const beforeUpload = (file: File): boolean => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        alert('只能上传图片文件！')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        alert('图片大小不能超过 2MB！')
        return false
      }
      return true
    }

    return (
      <LMUpload
        beforeUpload={beforeUpload}
        accept="image/*"
        multiple
        listType="picture"
        placeholder="点击或拖拽图片到此区域"
        hint="仅支持 2MB 以内的图片"
      />
    )
  },
}

/** 尺寸展示 - 从超小到超大的所有尺寸 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p className="text-xs mb-2" style={{ color: 'var(--lm-text-secondary)' }}>xs - 超小</p>
        <LMUpload size="xs" placeholder="点击上传" hint="xs 尺寸" />
      </div>
      <div>
        <p className="text-xs mb-2" style={{ color: 'var(--lm-text-secondary)' }}>sm - 小</p>
        <LMUpload size="sm" placeholder="点击上传" hint="sm 尺寸" />
      </div>
      <div>
        <p className="text-xs mb-2" style={{ color: 'var(--lm-text-secondary)' }}>md - 中（默认）</p>
        <LMUpload size="md" placeholder="点击上传" hint="md 尺寸" />
      </div>
      <div>
        <p className="text-xs mb-2" style={{ color: 'var(--lm-text-secondary)' }}>lg - 大</p>
        <LMUpload size="lg" placeholder="点击上传" hint="lg 尺寸" />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

/** 完整示例 - 头像上传 */
export const AvatarUpload: Story = {
  render: () => {
    const [avatar, setAvatar] = useState<LMUploadFile[]>([])

    const beforeUpload = (file: File): boolean => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        alert('只能上传图片！')
        return false
      }
      return true
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: 'var(--lm-bg-paper)', border: '2px dashed var(--lm-border-default)' }}
        >
          {avatar.length > 0 && avatar[0].url ? (
            <img src={avatar[0].url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span style={{ color: 'var(--lm-text-tertiary)', fontSize: '12px' }}>暂无头像</span>
          )}
        </div>
        <LMUpload
          fileList={avatar}
          onChange={(list) => setAvatar(list.slice(-1))}
          accept="image/*"
          beforeUpload={beforeUpload}
          showFileList={false}
          maxCount={1}
        >
          <button
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: 'var(--lm-bg-elevated)',
              color: 'var(--lm-text-primary)',
              border: '1px solid var(--lm-border-default)',
            }}
          >
            更换头像
          </button>
        </LMUpload>
      </div>
    )
  },
}
