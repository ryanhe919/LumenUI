import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LMBadge from './LMBadge'

describe('LMBadge', () => {
  it('renders children correctly', () => {
    render(<LMBadge>Test Badge</LMBadge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('renders with default variant (primary)', () => {
    const { container } = render(<LMBadge>Primary</LMBadge>)
    // The outer span is the badge container
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('inline-flex', 'rounded-full')
    expect(badge.style.backgroundColor).toBe('var(--lm-primary-100)')
  })

  it('renders with success variant', () => {
    const { container } = render(<LMBadge variant="success">Success</LMBadge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.style.backgroundColor).toBe('var(--lm-success-100)')
  })

  it('renders with error variant', () => {
    const { container } = render(<LMBadge variant="error">Error</LMBadge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.style.backgroundColor).toBe('var(--lm-error-100)')
  })

  it('renders with dot when dot prop is true', () => {
    const { container } = render(<LMBadge dot>With Dot</LMBadge>)
    // The badge container should have a dot span as first child
    const badge = container.firstChild as HTMLElement
    const dot = badge.querySelector('.rounded-full')
    expect(dot).toBeInTheDocument()
  })

  it('renders with icon when icon prop is provided', () => {
    render(
      <LMBadge icon={<span data-testid="icon">Icon</span>}>With Icon</LMBadge>
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<LMBadge className="custom-class">Custom</LMBadge>)
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('custom-class')
  })

  it('renders different sizes', () => {
    const { rerender, container } = render(<LMBadge size="xs">XS</LMBadge>)
    // The outer span (badge container) has the text classes
    expect(container.firstChild).toHaveClass('text-xs')

    rerender(<LMBadge size="lg">LG</LMBadge>)
    expect(container.firstChild).toHaveClass('text-sm')
  })
})
