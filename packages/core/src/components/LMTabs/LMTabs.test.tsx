import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LMTabs from './LMTabs'

const mockItems = [
  { key: 'tab1', label: 'Tab 1', children: <div>Content 1</div> },
  { key: 'tab2', label: 'Tab 2', children: <div>Content 2</div> },
  { key: 'tab3', label: 'Tab 3', children: <div>Content 3</div> },
]

describe('LMTabs', () => {
  it('renders all tab labels', () => {
    render(<LMTabs items={mockItems} />)
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
  })

  it('shows first tab content by default', () => {
    render(<LMTabs items={mockItems} />)
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  it('shows content for defaultActiveKey', () => {
    render(<LMTabs items={mockItems} defaultActiveKey="tab2" />)
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('switches content when tab is clicked', () => {
    render(<LMTabs items={mockItems} />)

    expect(screen.getByText('Content 1')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Tab 2'))
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('calls onChange when tab is clicked', () => {
    const handleChange = vi.fn()
    render(<LMTabs items={mockItems} onChange={handleChange} />)

    fireEvent.click(screen.getByText('Tab 2'))
    expect(handleChange).toHaveBeenCalledWith('tab2')
  })

  it('calls onTabClick when tab is clicked', () => {
    const handleTabClick = vi.fn()
    render(<LMTabs items={mockItems} onTabClick={handleTabClick} />)

    fireEvent.click(screen.getByText('Tab 2'))
    expect(handleTabClick).toHaveBeenCalledWith('tab2')
  })

  it('respects controlled activeKey', () => {
    const { rerender } = render(<LMTabs items={mockItems} activeKey="tab1" />)
    expect(screen.getByText('Content 1')).toBeInTheDocument()

    rerender(<LMTabs items={mockItems} activeKey="tab3" />)
    expect(screen.getByText('Content 3')).toBeInTheDocument()
  })

  it('does not switch tabs for disabled items', () => {
    const handleChange = vi.fn()
    const itemsWithDisabled = [
      { key: 'tab1', label: 'Tab 1', children: <div>Content 1</div> },
      { key: 'tab2', label: 'Tab 2', disabled: true, children: <div>Content 2</div> },
    ]

    render(<LMTabs items={itemsWithDisabled} onChange={handleChange} />)

    fireEvent.click(screen.getByText('Tab 2'))
    expect(handleChange).not.toHaveBeenCalled()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  it('renders icons when provided', () => {
    const itemsWithIcons = [
      { key: 'tab1', label: 'Tab 1', icon: <span data-testid="icon-1">I</span>, children: <div>Content 1</div> },
    ]

    render(<LMTabs items={itemsWithIcons} />)
    expect(screen.getByTestId('icon-1')).toBeInTheDocument()
  })

  it('renders tabBarExtraContent', () => {
    render(
      <LMTabs
        items={mockItems}
        tabBarExtraContent={<button>Extra</button>}
      />
    )
    expect(screen.getByText('Extra')).toBeInTheDocument()
  })

  it('applies correct role attributes', () => {
    render(<LMTabs items={mockItems} defaultActiveKey="tab1" />)

    const tabList = screen.getByRole('tablist')
    expect(tabList).toBeInTheDocument()

    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(3)

    const activeTab = tabs[0]
    expect(activeTab).toHaveAttribute('aria-selected', 'true')

    const tabPanel = screen.getByRole('tabpanel')
    expect(tabPanel).toBeInTheDocument()
  })

  it('renders different types correctly', () => {
    const { rerender, container } = render(<LMTabs items={mockItems} type="line" />)
    expect(container.firstChild).toBeInTheDocument()

    rerender(<LMTabs items={mockItems} type="card" />)
    expect(container.firstChild).toBeInTheDocument()

    rerender(<LMTabs items={mockItems} type="rounded" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('centers tabs when centered prop is true', () => {
    const { container } = render(<LMTabs items={mockItems} centered />)
    const tabBar = container.querySelector('.justify-center')
    expect(tabBar).toBeInTheDocument()
  })

  it('handles items without children', () => {
    const itemsWithoutChildren = [
      { key: 'tab1', label: 'Tab 1' },
      { key: 'tab2', label: 'Tab 2' },
    ]

    render(<LMTabs items={itemsWithoutChildren} />)
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    // No tabpanel should be rendered
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
  })
})
