import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMStatCard from './LMStatCard'

describe('LMStatCard', () => {
  it('renders title and value', () => {
    render(<LMStatCard title="Total Users" value={1234} />)

    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('1234')).toBeInTheDocument()
  })

  it('renders string value', () => {
    render(<LMStatCard title="Status" value="Active" />)

    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(
      <LMStatCard
        title="Revenue"
        value={50000}
        description="Monthly revenue"
      />
    )

    expect(screen.getByText('Monthly revenue')).toBeInTheDocument()
  })

  it('renders prefix', () => {
    render(<LMStatCard title="Revenue" value={50000} prefix="$" />)

    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('renders suffix', () => {
    render(<LMStatCard title="Growth" value={25} suffix="%" />)

    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(
      <LMStatCard
        title="Users"
        value={100}
        icon={<span data-testid="custom-icon">Icon</span>}
      />
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('renders positive trend', () => {
    render(<LMStatCard title="Sales" value={1000} trend={15} />)

    expect(screen.getByText('15%')).toBeInTheDocument()
  })

  it('renders negative trend', () => {
    render(<LMStatCard title="Churn" value={50} trend={-8} />)

    expect(screen.getByText('8%')).toBeInTheDocument()
  })

  it('renders zero trend', () => {
    render(<LMStatCard title="Retention" value={100} trend={0} />)

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('renders trend text', () => {
    render(
      <LMStatCard
        title="Sales"
        value={1000}
        trend={15}
        trendText="vs last month"
      />
    )

    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })

  it('handles click when clickable', () => {
    const handleClick = vi.fn()
    render(
      <LMStatCard
        title="Users"
        value={100}
        clickable
        onClick={handleClick}
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('handles keyboard navigation when clickable', () => {
    const handleClick = vi.fn()
    render(
      <LMStatCard
        title="Users"
        value={100}
        clickable
        onClick={handleClick}
      />
    )

    const card = screen.getByRole('button')
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalled()

    fireEvent.keyDown(card, { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('has correct aria attributes when clickable', () => {
    render(
      <LMStatCard
        title="Users"
        value={100}
        clickable
        onClick={vi.fn()}
      />
    )

    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('aria-label', 'Users')
    expect(card).toHaveAttribute('tabindex', '0')
  })

  it('does not have button role when not clickable', () => {
    render(<LMStatCard title="Users" value={100} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const variants: Array<'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = [
      'default',
      'primary',
      'success',
      'warning',
      'error',
      'info',
    ]

    variants.forEach((variant) => {
      const { unmount } = render(
        <LMStatCard title="Test" value={100} variant={variant} />
      )
      expect(screen.getByText('Test')).toBeInTheDocument()
      unmount()
    })
  })

  it('renders with different sizes', () => {
    const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'> = [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
    ]

    sizes.forEach((size) => {
      const { unmount } = render(
        <LMStatCard title="Test" value={100} size={size} />
      )
      expect(screen.getByText('Test')).toBeInTheDocument()
      unmount()
    })
  })

  it('renders without border when bordered is false', () => {
    render(<LMStatCard title="Test" value={100} bordered={false} />)

    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('renders without shadow when shadow is false', () => {
    render(<LMStatCard title="Test" value={100} shadow={false} />)

    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('renders in compact mode', () => {
    render(<LMStatCard title="Test" value={100} compact />)

    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <LMStatCard title="Test" value={100} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})
