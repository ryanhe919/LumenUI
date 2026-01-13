import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LMDropdown from './LMDropdown'

const mockMenu = [
  { key: 'edit', label: 'Edit' },
  { key: 'copy', label: 'Copy' },
  { key: 'divider', label: '', divider: true },
  { key: 'delete', label: 'Delete', danger: true },
]

describe('LMDropdown', () => {
  it('renders trigger element', () => {
    render(
      <LMDropdown menu={mockMenu}>
        <button>Click me</button>
      </LMDropdown>
    )
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('shows dropdown on click', async () => {
    render(
      <LMDropdown menu={mockMenu}>
        <button>Click me</button>
      </LMDropdown>
    )

    fireEvent.click(screen.getByText('Click me'))

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
      expect(screen.getByText('Copy')).toBeInTheDocument()
      expect(screen.getByText('Delete')).toBeInTheDocument()
    })
  })

  it('hides dropdown on second click', async () => {
    render(
      <LMDropdown menu={mockMenu}>
        <button>Click me</button>
      </LMDropdown>
    )

    fireEvent.click(screen.getByText('Click me'))
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Click me'))
    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    })
  })

  it('calls onSelect when item is clicked', async () => {
    const handleSelect = vi.fn()
    render(
      <LMDropdown menu={mockMenu} onSelect={handleSelect}>
        <button>Click me</button>
      </LMDropdown>
    )

    fireEvent.click(screen.getByText('Click me'))
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Edit'))
    expect(handleSelect).toHaveBeenCalledWith('edit')
  })

  it('closes dropdown after selection', async () => {
    render(
      <LMDropdown menu={mockMenu}>
        <button>Click me</button>
      </LMDropdown>
    )

    fireEvent.click(screen.getByText('Click me'))
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Edit'))
    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    })
  })

  it('does not call onSelect for disabled items', async () => {
    const handleSelect = vi.fn()
    const menuWithDisabled = [
      { key: 'edit', label: 'Edit' },
      { key: 'disabled', label: 'Disabled Item', disabled: true },
    ]

    render(
      <LMDropdown menu={menuWithDisabled} onSelect={handleSelect}>
        <button>Click me</button>
      </LMDropdown>
    )

    fireEvent.click(screen.getByText('Click me'))
    await waitFor(() => {
      expect(screen.getByText('Disabled Item')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Disabled Item'))
    expect(handleSelect).not.toHaveBeenCalled()
  })

  it('calls onVisibleChange when visibility changes', async () => {
    const handleVisibleChange = vi.fn()
    render(
      <LMDropdown menu={mockMenu} onVisibleChange={handleVisibleChange}>
        <button>Click me</button>
      </LMDropdown>
    )

    fireEvent.click(screen.getByText('Click me'))
    expect(handleVisibleChange).toHaveBeenCalledWith(true)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleVisibleChange).toHaveBeenCalledWith(false)
  })

  it('does not open when disabled', () => {
    render(
      <LMDropdown menu={mockMenu} disabled>
        <button>Click me</button>
      </LMDropdown>
    )

    fireEvent.click(screen.getByText('Click me'))
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  it('renders dividers correctly', async () => {
    render(
      <LMDropdown menu={mockMenu}>
        <button>Click me</button>
      </LMDropdown>
    )

    fireEvent.click(screen.getByText('Click me'))
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    // Check that we have menu items plus a divider
    const menuItems = screen.getAllByRole('menuitem')
    expect(menuItems).toHaveLength(3) // 3 items, divider is not a menuitem
  })

  it('renders icons when provided', async () => {
    const menuWithIcons = [
      { key: 'edit', label: 'Edit', icon: <span data-testid="edit-icon">E</span> },
    ]

    render(
      <LMDropdown menu={menuWithIcons}>
        <button>Click me</button>
      </LMDropdown>
    )

    fireEvent.click(screen.getByText('Click me'))
    await waitFor(() => {
      expect(screen.getByTestId('edit-icon')).toBeInTheDocument()
    })
  })

  it('applies danger style to danger items', async () => {
    render(
      <LMDropdown menu={mockMenu}>
        <button>Click me</button>
      </LMDropdown>
    )

    fireEvent.click(screen.getByText('Click me'))
    await waitFor(() => {
      const deleteItem = screen.getByText('Delete')
      expect(deleteItem.parentElement).toHaveStyle({ color: 'var(--lm-error-600)' })
    })
  })

  it('closes on click outside', async () => {
    render(
      <div>
        <LMDropdown menu={mockMenu}>
          <button>Click me</button>
        </LMDropdown>
        <button>Outside</button>
      </div>
    )

    fireEvent.click(screen.getByText('Click me'))
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    fireEvent.mouseDown(screen.getByText('Outside'))
    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    })
  })
})
