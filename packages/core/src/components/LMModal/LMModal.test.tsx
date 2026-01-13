import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMModal from './LMModal'

describe('LMModal', () => {
  it('does not render when visible is false', () => {
    render(
      <LMModal visible={false} title="Test Modal">
        <p>Modal content</p>
      </LMModal>
    )
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })

  it('renders when visible is true', () => {
    render(
      <LMModal visible={true} title="Test Modal">
        <p>Modal content</p>
      </LMModal>
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <LMModal visible={true} title="Test">
        <p data-testid="content">Custom content</p>
      </LMModal>
    )
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <LMModal visible={true} title="Test" onClose={handleClose}>
        <p>Content</p>
      </LMModal>
    )

    const closeButton = screen.getByLabelText('Close dialog')
    fireEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalled()
  })

  it('calls onOk when OK button is clicked', () => {
    const handleOk = vi.fn()
    render(
      <LMModal visible={true} title="Test" onOk={handleOk}>
        <p>Content</p>
      </LMModal>
    )

    const okButton = screen.getByText('Confirm')
    fireEvent.click(okButton)
    expect(handleOk).toHaveBeenCalled()
  })

  it('calls onCancel when Cancel button is clicked', () => {
    const handleCancel = vi.fn()
    render(
      <LMModal visible={true} title="Test" onCancel={handleCancel}>
        <p>Content</p>
      </LMModal>
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    expect(handleCancel).toHaveBeenCalled()
  })

  it('uses custom button text', () => {
    render(
      <LMModal visible={true} title="Test" okText="Submit" cancelText="Discard">
        <p>Content</p>
      </LMModal>
    )
    expect(screen.getByText('Submit')).toBeInTheDocument()
    expect(screen.getByText('Discard')).toBeInTheDocument()
  })

  it('hides OK button when showOk is false', () => {
    render(
      <LMModal visible={true} title="Test" showOk={false}>
        <p>Content</p>
      </LMModal>
    )
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument()
  })

  it('hides Cancel button when showCancel is false', () => {
    render(
      <LMModal visible={true} title="Test" showCancel={false}>
        <p>Content</p>
      </LMModal>
    )
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
  })

  it('hides close button when closable is false', () => {
    render(
      <LMModal visible={true} title="Test" closable={false}>
        <p>Content</p>
      </LMModal>
    )
    expect(screen.queryByLabelText('Close dialog')).not.toBeInTheDocument()
  })

  it('renders custom footer', () => {
    render(
      <LMModal visible={true} title="Test" footer={<button>Custom Footer</button>}>
        <p>Content</p>
      </LMModal>
    )
    expect(screen.getByText('Custom Footer')).toBeInTheDocument()
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument()
  })

  it('renders no footer when footer is null', () => {
    render(
      <LMModal visible={true} title="Test" footer={null} showOk={false} showCancel={false}>
        <p>Content</p>
      </LMModal>
    )
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument()
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
  })

  it('shows loading state on OK button', () => {
    render(
      <LMModal visible={true} title="Test" okLoading>
        <p>Content</p>
      </LMModal>
    )
    const okButton = screen.getByText('Confirm').closest('button')
    expect(okButton).toBeDisabled()
  })
})
