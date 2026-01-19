declare module '@ryanhe919/lumen-ui' {
  import { ComponentType, ReactNode, CSSProperties, ChangeEvent, MouseEvent } from 'react'

  // 通用类型
  export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  // Button
  export interface LMButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
    size?: ComponentSize
    disabled?: boolean
    loading?: boolean
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    children?: ReactNode
    className?: string
  }
  export const LMButton: ComponentType<LMButtonProps>

  // Badge
  export interface LMBadgeProps {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
    size?: ComponentSize
    children?: ReactNode
    className?: string
  }
  export const LMBadge: ComponentType<LMBadgeProps>

  // Input
  export interface LMInputProps {
    value?: string
    defaultValue?: string
    placeholder?: string
    disabled?: boolean
    size?: ComponentSize
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    className?: string
  }
  export const LMInput: ComponentType<LMInputProps>

  // Checkbox
  export interface LMCheckboxProps {
    label: string
    description?: string
    checked?: boolean
    disabled?: boolean
    error?: boolean
    errorMessage?: string
    size?: ComponentSize
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    className?: string
  }
  export const LMCheckbox: ComponentType<LMCheckboxProps>

  // Switch
  export interface LMSwitchProps {
    label?: string
    description?: string
    checked?: boolean
    disabled?: boolean
    error?: boolean
    errorMessage?: string
    size?: ComponentSize
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    className?: string
  }
  export const LMSwitch: ComponentType<LMSwitchProps>

  // Radio
  export interface LMRadioProps {
    label: string
    description?: string
    name?: string
    value?: string
    checked?: boolean
    disabled?: boolean
    error?: boolean
    errorMessage?: string
    size?: ComponentSize
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    className?: string
  }
  export const LMRadio: ComponentType<LMRadioProps>

  // ChatBubble
  export interface LMChatBubbleProps {
    role?: 'user' | 'assistant' | 'system'
    variant?: 'default' | 'filled' | 'outline' | 'soft'
    size?: ComponentSize
    isStreaming?: boolean
    error?: boolean
    footer?: ReactNode
    children?: ReactNode
    className?: string
  }
  export const LMChatBubble: ComponentType<LMChatBubbleProps>

  // ChatInput
  export interface LMChatInputProps {
    value?: string
    placeholder?: string
    disabled?: boolean
    sending?: boolean
    isGenerating?: boolean
    size?: ComponentSize
    maxLength?: number
    showCount?: boolean
    showSendButton?: boolean
    onChange?: (value: string) => void
    onSend?: (value: string) => void
    onStop?: () => void
    toolbar?: ReactNode
    className?: string
  }
  export const LMChatInput: ComponentType<LMChatInputProps>

  // ChatContainer
  export interface ChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
  }
  export interface LMChatContainerProps {
    messages: ChatMessage[]
    height?: string | number
    header?: ReactNode
    placeholder?: string
    isGenerating?: boolean
    showTypingIndicator?: boolean
    typingIndicatorText?: string
    size?: ComponentSize
    onSend?: (content: string) => void
    onStop?: () => void
    className?: string
  }
  export const LMChatContainer: ComponentType<LMChatContainerProps>

  // CodeBlock
  export interface LMCodeBlockProps {
    code: string
    language?: string
    filename?: string
    size?: ComponentSize
    showLineNumbers?: boolean
    showCopyButton?: boolean
    highlightLines?: number[]
    maxHeight?: string | number
    wrapLines?: boolean
    enableHighlight?: boolean
    className?: string
  }
  export const LMCodeBlock: ComponentType<LMCodeBlockProps>

  // MarkdownRenderer
  export interface LMMarkdownRendererProps {
    content: string
    size?: ComponentSize
    allowHtml?: boolean
    openLinksInNewTab?: boolean
    className?: string
  }
  export const LMMarkdownRenderer: ComponentType<LMMarkdownRendererProps>

  // Table
  export interface LMTableColumn<T = Record<string, unknown>> {
    title: string
    dataIndex: string
    width?: string | number
    render?: (value: unknown, record: T, index: number) => ReactNode
    sorter?: boolean
    align?: 'left' | 'center' | 'right'
  }
  export interface LMTableProps<T = Record<string, unknown>> {
    dataSource: T[]
    columns: LMTableColumn<T>[]
    rowKey?: string | ((record: T, index: number) => string)
    loading?: boolean
    bordered?: boolean
    striped?: boolean
    emptyText?: string
    size?: ComponentSize
    className?: string
  }
  export const LMTable: ComponentType<LMTableProps>

  // Pagination
  export interface LMPaginationProps {
    current?: number
    total: number
    pageSize?: number
    onChange?: (page: number, pageSize: number) => void
    showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode)
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    pageSizeOptions?: number[]
    simple?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    disabled?: boolean
    className?: string
  }
  export const LMPagination: ComponentType<LMPaginationProps>

  // Message
  export type LMMessageType = 'success' | 'error' | 'warning' | 'info'
  export interface LMMessageItem {
    id: string
    type: LMMessageType
    title?: string
    content: string
    duration?: number
  }
  export interface LMMessageProps {
    id: string
    type: LMMessageType
    title?: string
    content: string
    duration?: number
    onClose: (id: string) => void
  }
  export const LMMessage: ComponentType<LMMessageProps>

  export interface LMMessageContainerProps {
    messages: LMMessageItem[]
    onClose: (id: string) => void
    position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
  }
  export const LMMessageContainer: ComponentType<LMMessageContainerProps>

  // Confirm
  export interface LMConfirmProps {
    visible: boolean
    title?: string
    content: string
    confirmText?: string
    cancelText?: string
    confirmButtonStyle?: 'primary' | 'danger'
    closeOnOverlayClick?: boolean
    onConfirm: () => void
    onCancel: () => void
  }
  export const LMConfirm: ComponentType<LMConfirmProps>

  // 导出所有其他组件
  export const LMTextarea: ComponentType<Record<string, unknown>>
  export const LMNumberInput: ComponentType<Record<string, unknown>>
  export const LMSearchInput: ComponentType<Record<string, unknown>>
  export const LMSelect: ComponentType<Record<string, unknown>>
  export const LMField: ComponentType<Record<string, unknown>>
  export const LMDatePicker: ComponentType<Record<string, unknown>>
  export const LMUpload: ComponentType<Record<string, unknown>>
  export const LMCard: ComponentType<Record<string, unknown>>
  export const LMTabs: ComponentType<Record<string, unknown>>
  export const LMTooltip: ComponentType<Record<string, unknown>>
  export const LMStatCard: ComponentType<Record<string, unknown>>
  export const LMEmpty: ComponentType<Record<string, unknown>>
  export const LMMenu: ComponentType<Record<string, unknown>>
  export const LMDropdown: ComponentType<Record<string, unknown>>
  export const LMModal: ComponentType<Record<string, unknown>>
  export const LMDrawer: ComponentType<Record<string, unknown>>
  export const LMChatList: ComponentType<Record<string, unknown>>
  export const LMChatMessage: ComponentType<Record<string, unknown>>
  export const LMTypingIndicator: ComponentType<Record<string, unknown>>
}

declare module '@ryanhe919/lumen-ui/styles.css'
