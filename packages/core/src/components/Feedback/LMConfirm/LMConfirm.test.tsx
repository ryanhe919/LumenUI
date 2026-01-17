import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMConfirm from './LMConfirm'

describe('LMConfirm', () => {
  it('does not render when visible is false', () => {
    render(
      <LMConfirm
        visible={false}
        content="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument()
  })

  it('renders when visible is true', () => {
    render(
      <LMConfirm
        visible={true}
        content="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('renders default title', () => {
    render(
      <LMConfirm
        visible={true}
        content="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    // The default title is "Confirm" and it appears in the h3 element
    expect(screen.getByRole('heading', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('renders custom title', () => {
    render(
      <LMConfirm
        visible={true}
        title="Delete Item"
        content="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(screen.getByText('Delete Item')).toBeInTheDocument()
  })

  it('renders default button text', () => {
    render(
      <LMConfirm
        visible={true}
        content="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    // Find buttons by role to distinguish from title
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('renders custom button text', () => {
    render(
      <LMConfirm
        visible={true}
        content="Are you sure?"
        confirmText="Yes, Delete"
        cancelText="No, Keep"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    )
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument()
    expect(screen.getByText('No, Keep')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    const handleConfirm = vi.fn()
    render(
      <LMConfirm
        visible={true}
        content="Are you sure?"
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(handleConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', () => {
    const handleCancel = vi.fn()
    render(
      <LMConfirm
        visible={true}
        content="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />
    )

    fireEvent.click(screen.getByText('Cancel'))
    expect(handleCancel).toHaveBeenCalled()
  })

  it('calls onCancel when overlay is clicked with closeOnOverlayClick true', () => {
    const handleCancel = vi.fn()
    render(
      <LMConfirm
        visible={true}
        content="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
        closeOnOverlayClick={true}
      />
    )

    const backdrop = document.querySelector('.backdrop-blur-sm')
    fireEvent.click(backdrop!)
    expect(handleCancel).toHaveBeenCalled()
  })

  it('does not call onCancel when overlay is clicked with closeOnOverlayClick false', () => {
    const handleCancel = vi.fn()
    render(
      <LMConfirm
        visible={true}
        content="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
        closeOnOverlayClick={false}
      />
    )

    const backdrop = document.querySelector('.backdrop-blur-sm')
    fireEvent.click(backdrop!)
    expect(handleCancel).not.toHaveBeenCalled()
  })
})
