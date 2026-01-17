/**
 * LMConfirm - 确认对话框组件
 * 用于需要用户二次确认的操作场景
 */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import LMConfirm from './LMConfirm'
import { useConfirm } from '../../../hooks/useConfirm'
import LMButton from '../../General/LMButton/LMButton'

const meta: Meta<typeof LMConfirm> = {
  title: '反馈 Feedback/LMConfirm 确认框',
  component: LMConfirm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '确认对话框组件，用于危险操作或重要决策前的二次确认。支持自定义标题、内容和按钮样式。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    confirmButtonStyle: {
      control: 'select',
      options: ['primary', 'danger'],
      description: '确认按钮的样式',
    },
    visible: {
      description: '是否显示对话框',
    },
    title: {
      description: '对话框标题',
    },
    content: {
      description: '对话框内容',
    },
    confirmText: {
      description: '确认按钮文字',
    },
    cancelText: {
      description: '取消按钮文字',
    },
    closeOnOverlayClick: {
      description: '是否允许点击遮罩关闭',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** 默认确认框 - 基础的确认对话框 */
export const Default: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <LMButton onClick={() => setVisible(true)}>Open Confirm</LMButton>
        <LMConfirm
          visible={visible}
          content="Are you sure you want to proceed with this action?"
          onConfirm={() => {
            console.log('Confirmed')
            setVisible(false)
          }}
          onCancel={() => setVisible(false)}
        />
      </>
    )
  },
}

/** 自定义标题 - 带有标题和自定义按钮文字 */
export const WithCustomTitle: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <LMButton onClick={() => setVisible(true)}>Save Changes</LMButton>
        <LMConfirm
          visible={visible}
          title="Save Changes"
          content="Do you want to save your changes before leaving?"
          confirmText="Save"
          cancelText="Discard"
          onConfirm={() => {
            console.log('Saved')
            setVisible(false)
          }}
          onCancel={() => setVisible(false)}
        />
      </>
    )
  },
}

/** 危险操作样式 - 用于删除等不可逆操作 */
export const DangerStyle: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <LMButton variant="danger" onClick={() => setVisible(true)}>Delete Item</LMButton>
        <LMConfirm
          visible={visible}
          title="Delete Item"
          content="This action cannot be undone. Are you sure you want to delete this item?"
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonStyle="danger"
          onConfirm={() => {
            console.log('Deleted')
            setVisible(false)
          }}
          onCancel={() => setVisible(false)}
        />
      </>
    )
  },
}

/** 禁止遮罩关闭 - 必须通过按钮操作 */
export const NoOverlayClose: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <LMButton onClick={() => setVisible(true)}>Important Action</LMButton>
        <LMConfirm
          visible={visible}
          title="Important Action"
          content="Please confirm or cancel. Clicking outside will not close this dialog."
          closeOnOverlayClick={false}
          onConfirm={() => {
            console.log('Confirmed')
            setVisible(false)
          }}
          onCancel={() => setVisible(false)}
        />
      </>
    )
  },
}

/** 使用 Hook - 通过 useConfirm 钩子调用 */
export const WithHook: Story = {
  render: () => {
    const { confirm, ConfirmDialog } = useConfirm()

    const handleDelete = async () => {
      const result = await confirm({
        title: 'Delete File',
        content: 'Are you sure you want to delete this file?',
        confirmText: 'Delete',
        confirmButtonStyle: 'danger',
      })

      if (result) {
        console.log('File deleted')
      } else {
        console.log('Cancelled')
      }
    }

    return (
      <>
        <LMButton variant="danger" onClick={handleDelete}>Delete File (Hook)</LMButton>
        <ConfirmDialog />
      </>
    )
  },
}

/** 多个确认框 - 同页面多个确认操作 */
export const MultipleConfirmations: Story = {
  render: () => {
    const { confirm, ConfirmDialog } = useConfirm()

    const handleSave = async () => {
      const result = await confirm({
        title: 'Save Changes',
        content: 'Do you want to save your changes?',
        confirmText: 'Save',
      })
      console.log('Save result:', result)
    }

    const handleDelete = async () => {
      const result = await confirm({
        title: 'Delete',
        content: 'This cannot be undone.',
        confirmText: 'Delete',
        confirmButtonStyle: 'danger',
      })
      console.log('Delete result:', result)
    }

    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <LMButton onClick={handleSave}>Save</LMButton>
        <LMButton variant="danger" onClick={handleDelete}>Delete</LMButton>
        <ConfirmDialog />
      </div>
    )
  },
}
