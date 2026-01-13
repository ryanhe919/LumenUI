import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LMUpload from './LMUpload'
import type { LMUploadFile } from './LMUpload'

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn(() => 'blob:test-url')
const mockRevokeObjectURL = vi.fn()
globalThis.URL.createObjectURL = mockCreateObjectURL
globalThis.URL.revokeObjectURL = mockRevokeObjectURL

describe('LMUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area with default placeholder', () => {
    render(<LMUpload />)
    expect(screen.getByText('点击或拖拽文件到此区域上传')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<LMUpload placeholder="选择文件" />)
    expect(screen.getByText('选择文件')).toBeInTheDocument()
  })

  it('renders with hint text', () => {
    render(<LMUpload hint="支持 jpg、png 格式" />)
    expect(screen.getByText('支持 jpg、png 格式')).toBeInTheDocument()
  })

  it('shows error message when error is true', () => {
    render(<LMUpload error errorMessage="请上传文件" />)
    expect(screen.getByText('请上传文件')).toBeInTheDocument()
  })

  it('disables the upload area when disabled is true', () => {
    render(<LMUpload disabled />)
    const dropzone = screen.getByRole('button')
    expect(dropzone).toHaveAttribute('aria-disabled', 'true')
  })

  it('opens file dialog on click', () => {
    render(<LMUpload />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(fileInput, 'click')

    const dropzone = screen.getByRole('button')
    fireEvent.click(dropzone)

    expect(clickSpy).toHaveBeenCalled()
  })

  it('does not open file dialog when disabled', () => {
    render(<LMUpload disabled />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(fileInput, 'click')

    const dropzone = screen.getByRole('button')
    fireEvent.click(dropzone)

    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('accepts file type restriction', () => {
    render(<LMUpload accept="image/*" />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).toHaveAttribute('accept', 'image/*')
  })

  it('allows multiple file selection', () => {
    render(<LMUpload multiple />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).toHaveAttribute('multiple')
  })

  it('renders default file list', () => {
    const defaultFileList: LMUploadFile[] = [
      { uid: '1', name: 'test.pdf', size: 1024, type: 'application/pdf', status: 'done' },
    ]
    render(<LMUpload defaultFileList={defaultFileList} />)
    expect(screen.getByText('test.pdf')).toBeInTheDocument()
    expect(screen.getByText('1 KB')).toBeInTheDocument()
  })

  it('renders controlled file list', () => {
    const fileList: LMUploadFile[] = [
      { uid: '1', name: 'document.pdf', size: 2048, type: 'application/pdf', status: 'done' },
    ]
    render(<LMUpload fileList={fileList} />)
    expect(screen.getByText('document.pdf')).toBeInTheDocument()
  })

  it('calls onChange when file is selected', async () => {
    const handleChange = vi.fn()
    render(<LMUpload onChange={handleChange} />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })

    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled()
    })
  })

  it('calls beforeUpload before uploading', async () => {
    const beforeUpload = vi.fn().mockReturnValue(true)
    render(<LMUpload beforeUpload={beforeUpload} />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })

    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(beforeUpload).toHaveBeenCalledWith(file)
    })
  })

  it('prevents upload when beforeUpload returns false', async () => {
    const handleChange = vi.fn()
    const beforeUpload = vi.fn().mockReturnValue(false)
    render(<LMUpload onChange={handleChange} beforeUpload={beforeUpload} />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })

    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(beforeUpload).toHaveBeenCalled()
    })

    // onChange should not be called since upload was prevented
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('removes file when delete button is clicked', async () => {
    const fileList: LMUploadFile[] = [
      { uid: '1', name: 'test.pdf', size: 1024, type: 'application/pdf', status: 'done' },
    ]
    const handleChange = vi.fn()
    render(<LMUpload fileList={fileList} onChange={handleChange} />)

    const deleteButton = screen.getByLabelText('删除 test.pdf')
    fireEvent.click(deleteButton)

    expect(handleChange).toHaveBeenCalledWith([])
  })

  it('calls onRemove before removing file', async () => {
    const fileList: LMUploadFile[] = [
      { uid: '1', name: 'test.pdf', size: 1024, type: 'application/pdf', status: 'done' },
    ]
    const handleRemove = vi.fn().mockReturnValue(true)
    const handleChange = vi.fn()
    render(<LMUpload fileList={fileList} onChange={handleChange} onRemove={handleRemove} />)

    const deleteButton = screen.getByLabelText('删除 test.pdf')
    fireEvent.click(deleteButton)

    expect(handleRemove).toHaveBeenCalled()
  })

  it('prevents removal when onRemove returns false', async () => {
    const fileList: LMUploadFile[] = [
      { uid: '1', name: 'test.pdf', size: 1024, type: 'application/pdf', status: 'done' },
    ]
    const handleRemove = vi.fn().mockReturnValue(false)
    const handleChange = vi.fn()
    render(<LMUpload fileList={fileList} onChange={handleChange} onRemove={handleRemove} />)

    const deleteButton = screen.getByLabelText('删除 test.pdf')
    fireEvent.click(deleteButton)

    expect(handleChange).not.toHaveBeenCalled()
  })

  it('hides file list when showFileList is false', () => {
    const fileList: LMUploadFile[] = [
      { uid: '1', name: 'test.pdf', size: 1024, type: 'application/pdf', status: 'done' },
    ]
    render(<LMUpload fileList={fileList} showFileList={false} />)
    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument()
  })

  it('shows uploading status with progress', () => {
    const fileList: LMUploadFile[] = [
      { uid: '1', name: 'test.pdf', size: 1024, type: 'application/pdf', status: 'uploading', percent: 50 },
    ]
    render(<LMUpload fileList={fileList} />)
    expect(screen.getByText('test.pdf')).toBeInTheDocument()
    // Progress bar should be rendered
    const progressBar = document.querySelector('[style*="width: 50%"]')
    expect(progressBar).toBeInTheDocument()
  })

  it('shows error status for failed uploads', () => {
    const fileList: LMUploadFile[] = [
      { uid: '1', name: 'test.pdf', size: 1024, type: 'application/pdf', status: 'error', error: '上传失败' },
    ]
    render(<LMUpload fileList={fileList} />)
    expect(screen.getByText('上传失败')).toBeInTheDocument()
  })

  it('renders custom children as trigger', () => {
    render(
      <LMUpload>
        <button data-testid="custom-trigger">Custom Upload Button</button>
      </LMUpload>
    )
    expect(screen.getByTestId('custom-trigger')).toBeInTheDocument()
    expect(screen.queryByText('点击或拖拽文件到此区域上传')).not.toBeInTheDocument()
  })

  it('handles drag and drop', () => {
    render(<LMUpload />)
    const dropzone = screen.getByRole('button')

    // Simulate drag over
    fireEvent.dragOver(dropzone)

    // Simulate drag leave
    fireEvent.dragLeave(dropzone)

    // Simulate drop
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const dataTransfer = {
      files: [file],
    }
    fireEvent.drop(dropzone, { dataTransfer })
  })

  it('opens file dialog on Enter key press', () => {
    render(<LMUpload />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(fileInput, 'click')

    const dropzone = screen.getByRole('button')
    fireEvent.keyDown(dropzone, { key: 'Enter' })

    expect(clickSpy).toHaveBeenCalled()
  })

  it('opens file dialog on Space key press', () => {
    render(<LMUpload />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const clickSpy = vi.spyOn(fileInput, 'click')

    const dropzone = screen.getByRole('button')
    fireEvent.keyDown(dropzone, { key: ' ' })

    expect(clickSpy).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<LMUpload className="custom-class" />)
    const container = document.querySelector('.custom-class')
    expect(container).toBeInTheDocument()
  })

  it('renders image preview in picture list type', () => {
    const fileList: LMUploadFile[] = [
      { uid: '1', name: 'image.jpg', size: 1024, type: 'image/jpeg', status: 'done', url: 'blob:test-url' },
    ]
    render(<LMUpload fileList={fileList} listType="picture" />)
    const img = screen.getByAltText('image.jpg')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'blob:test-url')
  })
})
