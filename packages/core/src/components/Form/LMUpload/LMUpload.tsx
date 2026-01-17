import React, { useState, useRef, useCallback, useId } from 'react'
import {
  COMPONENT_SIZE_ORDER,
  SIZE_TEXT_CLASSES,
  SIZE_GAP_CLASSES,
  SIZE_PADDING_CLASSES,
  clampComponentSize,
} from '../../../utils/componentSizes'
import type { ComponentSize } from '../../../utils/componentSizes'

export interface LMUploadFile {
  /** Unique file ID */
  uid: string
  /** File name */
  name: string
  /** File size in bytes */
  size: number
  /** File type */
  type: string
  /** Upload status */
  status: 'uploading' | 'done' | 'error'
  /** Upload progress (0-100) */
  percent?: number
  /** Error message */
  error?: string
  /** Original file object */
  originFile?: File
  /** Preview URL (for images) */
  url?: string
}

export interface LMUploadProps {
  /** File list (controlled) */
  fileList?: LMUploadFile[]
  /** Default file list */
  defaultFileList?: LMUploadFile[]
  /** Accept file types (e.g., "image/*,.pdf") */
  accept?: string
  /** Allow multiple files */
  multiple?: boolean
  /** Max file count */
  maxCount?: number
  /** Max file size in bytes */
  maxSize?: number
  /** Disabled state */
  disabled?: boolean
  /** Show file list */
  showFileList?: boolean
  /** Upload mode: drag area or button */
  listType?: 'text' | 'picture'
  /** Component size */
  size?: ComponentSize
  /** Custom upload handler */
  customRequest?: (file: File) => Promise<string>
  /** Change handler */
  onChange?: (fileList: LMUploadFile[]) => void
  /** Before upload hook, return false to prevent upload */
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  /** Remove handler */
  onRemove?: (file: LMUploadFile) => void | boolean | Promise<boolean>
  /** Error state */
  error?: boolean
  /** Error message */
  errorMessage?: string
  /** Placeholder text */
  placeholder?: string
  /** Hint text below the upload area */
  hint?: string
  /** Custom class name */
  className?: string
  /** Children for custom trigger */
  children?: React.ReactNode
}

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || 'w-8 h-8'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
)

const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
)

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
)

const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
  </svg>
)

let fileIdCounter = 0
const generateFileId = () => `upload-${++fileIdCounter}-${Date.now()}`

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const isImageFile = (file: LMUploadFile): boolean => {
  return file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(file.name)
}

const LMUpload: React.FC<LMUploadProps> = ({
  fileList: controlledFileList,
  defaultFileList = [],
  accept,
  multiple = false,
  maxCount,
  maxSize,
  disabled = false,
  showFileList = true,
  listType = 'text',
  size = 'md',
  customRequest,
  onChange,
  beforeUpload,
  onRemove,
  error = false,
  errorMessage,
  placeholder = '点击或拖拽文件到此区域上传',
  hint,
  className = '',
  children,
}) => {
  const resolvedSize = clampComponentSize(size, COMPONENT_SIZE_ORDER)
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [internalFileList, setInternalFileList] = useState<LMUploadFile[]>(defaultFileList)
  const [isDragging, setIsDragging] = useState(false)

  const fileList = controlledFileList ?? internalFileList

  const updateFileList = useCallback((newFileList: LMUploadFile[]) => {
    if (controlledFileList === undefined) {
      setInternalFileList(newFileList)
    }
    onChange?.(newFileList)
  }, [controlledFileList, onChange])

  const uploadFile = useCallback(async (file: File) => {
    const uid = generateFileId()
    const newFile: LMUploadFile = {
      uid,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      percent: 0,
      originFile: file,
    }

    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      newFile.url = URL.createObjectURL(file)
    }

    // Add file to list
    const updatedList = [...fileList, newFile]
    updateFileList(updatedList)

    if (customRequest) {
      try {
        const url = await customRequest(file)
        updateFileList([...updatedList.slice(0, -1), { ...newFile, status: 'done', percent: 100, url }])
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : '上传失败'
        updateFileList([...updatedList.slice(0, -1), { ...newFile, status: 'error', error: errorMsg }])
      }
    } else {
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setInternalFileList(prev => prev.map(f =>
            f.uid === uid ? { ...f, status: 'done' as const, percent: 100 } : f
          ))
        } else {
          setInternalFileList(prev => prev.map(f =>
            f.uid === uid ? { ...f, percent: Math.round(progress) } : f
          ))
        }
      }, 200)
    }
  }, [fileList, customRequest, updateFileList])

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return

    const fileArray = Array.from(files)

    for (const file of fileArray) {
      // Check max count
      if (maxCount && fileList.length >= maxCount) {
        console.warn(`Max file count (${maxCount}) reached`)
        break
      }

      // Check max size
      if (maxSize && file.size > maxSize) {
        console.warn(`File ${file.name} exceeds max size (${formatFileSize(maxSize)})`)
        continue
      }

      // Before upload hook
      if (beforeUpload) {
        const result = await beforeUpload(file)
        if (!result) continue
      }

      await uploadFile(file)
    }
  }, [disabled, maxCount, maxSize, fileList.length, beforeUpload, uploadFile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (!disabled) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemove = async (file: LMUploadFile) => {
    if (onRemove) {
      const result = await onRemove(file)
      if (result === false) return
    }

    // Revoke object URL to prevent memory leaks
    if (file.url?.startsWith('blob:')) {
      URL.revokeObjectURL(file.url)
    }

    const newFileList = fileList.filter(f => f.uid !== file.uid)
    updateFileList(newFileList)
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const iconSizeClasses: Record<ComponentSize, string> = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
    '2xl': 'w-14 h-14',
  }

  const thumbSizeClasses: Record<ComponentSize, string> = {
    xs: 'w-10 h-10',
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
  }

  const getDropzoneStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      backgroundColor: 'var(--lm-bg-elevated)',
      borderColor: error ? 'var(--lm-error-300)' : 'var(--lm-border-default)',
    }

    if (disabled) {
      return {
        ...base,
        backgroundColor: 'var(--lm-bg-paper)',
        cursor: 'not-allowed',
        opacity: 0.6,
      }
    }

    if (isDragging) {
      return {
        ...base,
        backgroundColor: 'var(--lm-primary-50)',
        borderColor: 'var(--lm-primary-400)',
      }
    }

    return base
  }

  const renderFileItem = (file: LMUploadFile) => {
    const isImage = isImageFile(file)

    return (
      <div
        key={file.uid}
        className={`flex items-center ${SIZE_GAP_CLASSES[resolvedSize]} ${SIZE_PADDING_CLASSES[resolvedSize]} rounded-xl border transition-all duration-200`}
        style={{
          backgroundColor: file.status === 'error' ? 'var(--lm-error-50)' : 'var(--lm-bg-paper)',
          borderColor: file.status === 'error' ? 'var(--lm-error-200)' : 'var(--lm-border-light)',
        }}
      >
        {/* Thumbnail / Icon */}
        {listType === 'picture' && isImage && file.url ? (
          <div
            className={`${thumbSizeClasses[resolvedSize]} rounded-lg overflow-hidden flex-shrink-0`}
            style={{ backgroundColor: 'var(--lm-bg-elevated)' }}
          >
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="p-2 rounded-lg flex-shrink-0"
            style={{
              backgroundColor: file.status === 'error' ? 'var(--lm-error-100)' : 'var(--lm-bg-elevated)',
              color: file.status === 'error' ? 'var(--lm-error-500)' : 'var(--lm-text-secondary)',
            }}
          >
            {isImage ? <ImageIcon className="w-5 h-5" /> : <FileIcon className="w-5 h-5" />}
          </div>
        )}

        {/* File info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`${SIZE_TEXT_CLASSES[resolvedSize]} font-medium truncate`}
              style={{ color: file.status === 'error' ? 'var(--lm-error-700)' : 'var(--lm-text-primary)' }}
              title={file.name}
            >
              {file.name}
            </span>
            {file.status === 'done' && (
              <span style={{ color: 'var(--lm-success-500)' }}>
                <CheckIcon className="w-4 h-4" />
              </span>
            )}
            {file.status === 'error' && (
              <span style={{ color: 'var(--lm-error-500)' }}>
                <ErrorIcon className="w-4 h-4" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs" style={{ color: 'var(--lm-text-tertiary)' }}>
              {formatFileSize(file.size)}
            </span>
            {file.status === 'error' && file.error && (
              <span className="text-xs" style={{ color: 'var(--lm-error-500)' }}>
                {file.error}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {file.status === 'uploading' && (
            <div className="mt-2">
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--lm-bg-active)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${file.percent || 0}%`,
                    backgroundColor: 'var(--lm-primary-500)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Remove button */}
        <button
          type="button"
          className="p-1.5 rounded-lg transition-colors duration-200 hover:bg-[var(--lm-bg-hover)] flex-shrink-0"
          style={{ color: 'var(--lm-text-tertiary)' }}
          onClick={() => handleRemove(file)}
          aria-label={`删除 ${file.name}`}
        >
          <DeleteIcon />
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
        aria-describedby={errorMessage ? `${inputId}-error` : undefined}
      />

      {/* Upload area */}
      {children ? (
        <div onClick={handleClick} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
          {children}
        </div>
      ) : (
        <div
          className={`
            ${SIZE_PADDING_CLASSES[resolvedSize]}
            border-2 border-dashed rounded-2xl
            flex flex-col items-center justify-center
            transition-all duration-200
            ${disabled ? '' : 'cursor-pointer hover:border-[var(--lm-primary-400)]'}
          `}
          style={getDropzoneStyles()}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
          }}
        >
          <div
            className="mb-3"
            style={{ color: isDragging ? 'var(--lm-primary-500)' : 'var(--lm-text-tertiary)' }}
          >
            <UploadIcon className={iconSizeClasses[resolvedSize]} />
          </div>
          <p
            className={`${SIZE_TEXT_CLASSES[resolvedSize]} font-medium text-center`}
            style={{ color: isDragging ? 'var(--lm-primary-600)' : 'var(--lm-text-secondary)' }}
          >
            {placeholder}
          </p>
          {hint && (
            <p
              className="text-xs mt-2 text-center"
              style={{ color: 'var(--lm-text-tertiary)' }}
            >
              {hint}
            </p>
          )}
        </div>
      )}

      {/* Error message */}
      {error && errorMessage && (
        <p
          id={`${inputId}-error`}
          className="text-xs flex items-center gap-1 mt-2"
          style={{ color: 'var(--lm-error-500)' }}
          role="alert"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </p>
      )}

      {/* File list */}
      {showFileList && fileList.length > 0 && (
        <div className={`mt-4 space-y-2`}>
          {fileList.map(renderFileItem)}
        </div>
      )}
    </div>
  )
}

export default LMUpload
