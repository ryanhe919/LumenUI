declare module 'react-live' {
  import { ComponentType, ReactNode } from 'react'

  export interface LiveProviderProps {
    code: string
    scope?: Record<string, unknown>
    noInline?: boolean
    transformCode?: (code: string) => string
    language?: string
    disabled?: boolean
    children?: ReactNode
  }

  export interface LiveEditorProps {
    className?: string
    style?: React.CSSProperties
    onChange?: (code: string) => void
  }

  export interface LiveErrorProps {
    className?: string
    style?: React.CSSProperties
  }

  export interface LivePreviewProps {
    className?: string
    style?: React.CSSProperties
    Component?: ComponentType
  }

  export const LiveProvider: ComponentType<LiveProviderProps>
  export const LiveEditor: ComponentType<LiveEditorProps>
  export const LiveError: ComponentType<LiveErrorProps>
  export const LivePreview: ComponentType<LivePreviewProps>
}
