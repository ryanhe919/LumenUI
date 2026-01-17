import { useState, useCallback } from 'react'
import type { LMMessageItem } from '../components/Feedback/LMMessage/LMMessage'

export interface UseMessageReturn {
  messages: LMMessageItem[]
  addMessage: (message: Omit<LMMessageItem, 'id'>) => string
  removeMessage: (id: string) => void
  success: (content: string, title?: string, duration?: number) => string
  error: (content: string, title?: string, duration?: number) => string
  warning: (content: string, title?: string, duration?: number) => string
  info: (content: string, title?: string, duration?: number) => string
  clearAll: () => void
}

let messageIdCounter = 0

export const useMessage = (): UseMessageReturn => {
  const [messages, setMessages] = useState<LMMessageItem[]>([])

  const addMessage = useCallback((message: Omit<LMMessageItem, 'id'>) => {
    const id = `lm-message-${++messageIdCounter}`
    setMessages((prev) => [...prev, { ...message, id }])
    return id
  }, [])

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const success = useCallback(
    (content: string, title?: string, duration?: number) => {
      return addMessage({ type: 'success', content, title, duration })
    },
    [addMessage]
  )

  const error = useCallback(
    (content: string, title?: string, duration?: number) => {
      return addMessage({ type: 'error', content, title, duration })
    },
    [addMessage]
  )

  const warning = useCallback(
    (content: string, title?: string, duration?: number) => {
      return addMessage({ type: 'warning', content, title, duration })
    },
    [addMessage]
  )

  const info = useCallback(
    (content: string, title?: string, duration?: number) => {
      return addMessage({ type: 'info', content, title, duration })
    },
    [addMessage]
  )

  const clearAll = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    addMessage,
    removeMessage,
    success,
    error,
    warning,
    info,
    clearAll,
  }
}
