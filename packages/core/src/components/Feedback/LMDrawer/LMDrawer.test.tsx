import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LMDrawer from './LMDrawer'

describe('LMDrawer', () => {
  it('renders when visible is true', () => {
    render(
      <LMDrawer visible title="Test Drawer">
        Drawer content
      </LMDrawer>
    )
    expect(screen.getByText('Drawer content')).toBeInTheDocument()
    expect(screen.getByText('Test Drawer')).toBeInTheDocument()
  })

  it('renders content but hidden when visible is false', () => {
    render(
      <LMDrawer visible={false} title="Test Drawer">
        Drawer content
      </LMDrawer>
    )
    // Content is still in DOM but drawer is translated off-screen
    expect(screen.getByText('Drawer content')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <LMDrawer visible title="Test" onClose={handleClose}>
        Content
      </LMDrawer>
    )

    fireEvent.click(screen.getByLabelText('关闭'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when mask is clicked', () => {
    const handleClose = vi.fn()
    render(
      <LMDrawer visible title="Test" onClose={handleClose}>
        Content
      </LMDrawer>
    )

    // Click on the mask (the first div with aria-hidden)
    const mask = document.querySelector('[aria-hidden="true"]')
    if (mask) {
      fireEvent.click(mask)
    }
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when mask is clicked and maskClosable is false', () => {
    const handleClose = vi.fn()
    render(
      <LMDrawer visible title="Test" onClose={handleClose} maskClosable={false}>
        Content
      </LMDrawer>
    )

    const mask = document.querySelector('[aria-hidden="true"]')
    if (mask) {
      fireEvent.click(mask)
    }
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('does not render mask when mask is false', () => {
    render(
      <LMDrawer visible title="Test" mask={false}>
        Content
      </LMDrawer>
    )

    expect(document.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
  })

  it('does not render close button when closable is false', () => {
    render(
      <LMDrawer visible title="Test" closable={false}>
        Content
      </LMDrawer>
    )

    expect(screen.queryByLabelText('关闭')).not.toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(
      <LMDrawer visible title="Test" footer={<button>Submit</button>}>
        Content
      </LMDrawer>
    )

    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('renders extra content in header', () => {
    render(
      <LMDrawer visible title="Test" extra={<span>Extra</span>}>
        Content
      </LMDrawer>
    )

    expect(screen.getByText('Extra')).toBeInTheDocument()
  })

  it('calls onClose when ESC is pressed', () => {
    const handleClose = vi.fn()
    render(
      <LMDrawer visible title="Test" onClose={handleClose}>
        Content
      </LMDrawer>
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('renders with correct role attributes', () => {
    render(
      <LMDrawer visible title="Test">
        Content
      </LMDrawer>
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('applies custom width', () => {
    render(
      <LMDrawer visible title="Test" width={500}>
        Content
      </LMDrawer>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveStyle({ width: '500px' })
  })

  it('applies custom height for top/bottom placement', () => {
    render(
      <LMDrawer visible title="Test" placement="bottom" height={300}>
        Content
      </LMDrawer>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveStyle({ height: '300px' })
  })

  it('renders children correctly', () => {
    render(
      <LMDrawer visible title="Test">
        <div data-testid="custom-content">Custom Content</div>
      </LMDrawer>
    )

    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
  })
})
