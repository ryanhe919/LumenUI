import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LMMenu from './LMMenu'
import type { LMMenuItem } from './LMMenu'

const mockItems: LMMenuItem[] = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
]

const nestedItems: LMMenuItem[] = [
  { key: 'home', label: 'Home' },
  {
    key: 'users',
    label: 'Users',
    children: [
      { key: 'user-list', label: 'User List' },
      { key: 'user-add', label: 'Add User' },
    ],
  },
]

describe('LMMenu', () => {
  it('renders all menu items', () => {
    render(<LMMenu items={mockItems} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('highlights selected item', () => {
    render(<LMMenu items={mockItems} selectedKeys={['home']} />)
    // The selected item should have different styling
    const homeItem = screen.getByText('Home').closest('[role="menuitem"]')
    expect(homeItem).toHaveStyle({ color: 'var(--lm-primary-600)' })
  })

  it('calls onSelect when item is clicked', () => {
    const handleSelect = vi.fn()
    render(<LMMenu items={mockItems} onSelect={handleSelect} />)

    fireEvent.click(screen.getByText('About'))
    expect(handleSelect).toHaveBeenCalledWith('about', ['about'])
  })

  it('does not call onSelect for disabled items', () => {
    const handleSelect = vi.fn()
    const itemsWithDisabled: LMMenuItem[] = [
      { key: 'home', label: 'Home' },
      { key: 'disabled', label: 'Disabled', disabled: true },
    ]

    render(<LMMenu items={itemsWithDisabled} onSelect={handleSelect} />)

    fireEvent.click(screen.getByText('Disabled'))
    expect(handleSelect).not.toHaveBeenCalled()
  })

  it('expands submenu when parent is clicked', () => {
    render(<LMMenu items={nestedItems} defaultOpenKeys={[]} />)

    // Initially, children should not be visible
    expect(screen.queryByText('User List')).not.toBeInTheDocument()

    // Click parent to expand
    fireEvent.click(screen.getByText('Users'))

    // Now children should be visible
    expect(screen.getByText('User List')).toBeInTheDocument()
    expect(screen.getByText('Add User')).toBeInTheDocument()
  })

  it('calls onOpenChange when submenu is toggled', () => {
    const handleOpenChange = vi.fn()
    render(<LMMenu items={nestedItems} onOpenChange={handleOpenChange} />)

    fireEvent.click(screen.getByText('Users'))
    expect(handleOpenChange).toHaveBeenCalledWith(['users'])
  })

  it('renders icons when provided', () => {
    const itemsWithIcons: LMMenuItem[] = [
      { key: 'home', label: 'Home', icon: <span data-testid="home-icon">H</span> },
    ]

    render(<LMMenu items={itemsWithIcons} />)
    expect(screen.getByTestId('home-icon')).toBeInTheDocument()
  })

  it('renders dividers', () => {
    const itemsWithDivider: LMMenuItem[] = [
      { key: 'home', label: 'Home' },
      { key: 'divider', label: '', type: 'divider' },
      { key: 'about', label: 'About' },
    ]

    const { container } = render(<LMMenu items={itemsWithDivider} />)
    expect(container.querySelector('.border-t')).toBeInTheDocument()
  })

  it('renders groups with labels', () => {
    const itemsWithGroup: LMMenuItem[] = [
      {
        key: 'group1',
        label: 'Group Label',
        type: 'group',
        children: [
          { key: 'item1', label: 'Item 1' },
        ],
      },
    ]

    render(<LMMenu items={itemsWithGroup} />)
    expect(screen.getByText('Group Label')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('shows only icons when collapsed', () => {
    const itemsWithIcons: LMMenuItem[] = [
      { key: 'home', label: 'Home', icon: <span data-testid="icon">H</span> },
    ]

    render(<LMMenu items={itemsWithIcons} collapsed />)

    expect(screen.getByTestId('icon')).toBeInTheDocument()
    // Label should not be visible when collapsed
    expect(screen.queryByText('Home')).not.toBeInTheDocument()
  })

  it('applies correct role attributes', () => {
    render(<LMMenu items={mockItems} />)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
  })

  it('respects controlled selectedKeys', () => {
    const { rerender } = render(<LMMenu items={mockItems} selectedKeys={['home']} />)

    const homeItem = screen.getByText('Home').closest('[role="menuitem"]')
    expect(homeItem).toHaveStyle({ color: 'var(--lm-primary-600)' })

    rerender(<LMMenu items={mockItems} selectedKeys={['about']} />)

    const aboutItem = screen.getByText('About').closest('[role="menuitem"]')
    expect(aboutItem).toHaveStyle({ color: 'var(--lm-primary-600)' })
  })

  it('respects controlled openKeys', () => {
    render(<LMMenu items={nestedItems} openKeys={['users']} />)

    expect(screen.getByText('User List')).toBeInTheDocument()
  })

  it('applies dark theme styles', () => {
    render(<LMMenu items={mockItems} theme="dark" selectedKeys={['home']} />)

    const homeItem = screen.getByText('Home').closest('[role="menuitem"]')
    expect(homeItem).toHaveStyle({ backgroundColor: 'var(--lm-primary-600)' })
  })
})
