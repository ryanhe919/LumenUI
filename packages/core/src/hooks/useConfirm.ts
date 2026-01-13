import React, { useState, useCallback } from 'react'
import type { LMConfirmProps } from '../components/LMConfirm/LMConfirm'
import LMConfirm from '../components/LMConfirm/LMConfirm'

export interface UseConfirmReturn {
  visible: boolean
  config: Omit<LMConfirmProps, 'visible' | 'onConfirm' | 'onCancel'> | null
  confirm: (options: {
    title?: string
    content: string
    confirmText?: string
    cancelText?: string
    confirmButtonStyle?: 'primary' | 'danger'
  }) => Promise<boolean>
  ConfirmDialog: React.FC
}

export const useConfirm = (): UseConfirmReturn => {
  const [visible, setVisible] = useState(false)
  const [config, setConfig] = useState<Omit<LMConfirmProps, 'visible' | 'onConfirm' | 'onCancel'> | null>(null)
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: {
    title?: string
    content: string
    confirmText?: string
    cancelText?: string
    confirmButtonStyle?: 'primary' | 'danger'
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig(options)
      setVisible(true)
      setResolveRef(() => resolve)
    })
  }, [])

  const handleConfirm = useCallback(() => {
    setVisible(false)
    resolveRef?.(true)
    setResolveRef(null)
  }, [resolveRef])

  const handleCancel = useCallback(() => {
    setVisible(false)
    resolveRef?.(false)
    setResolveRef(null)
  }, [resolveRef])

  const ConfirmDialog: React.FC = useCallback(() => {
    if (!config) return null
    return React.createElement(LMConfirm, {
      visible,
      ...config,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    })
  }, [visible, config, handleConfirm, handleCancel])

  return {
    visible,
    config,
    confirm,
    ConfirmDialog,
  }
}
