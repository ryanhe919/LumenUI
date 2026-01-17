import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LMCard from './LMCard'

describe('LMCard', () => {
  it('renders children correctly', () => {
    render(<LMCard>Card content</LMCard>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<LMCard title="Test Title">Content</LMCard>)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders extra content when provided', () => {
    render(
      <LMCard title="Title" extra={<span>Extra</span>}>
        Content
      </LMCard>
    )
    expect(screen.getByText('Extra')).toBeInTheDocument()
  })

  it('renders cover when provided', () => {
    render(
      <LMCard cover={<img src="test.jpg" alt="Cover" />}>
        Content
      </LMCard>
    )
    expect(screen.getByAltText('Cover')).toBeInTheDocument()
  })

  it('renders actions when provided', () => {
    render(
      <LMCard actions={[<span key="1">Action 1</span>, <span key="2">Action 2</span>]}>
        Content
      </LMCard>
    )
    expect(screen.getByText('Action 1')).toBeInTheDocument()
    expect(screen.getByText('Action 2')).toBeInTheDocument()
  })

  it('shows skeleton when loading', () => {
    render(
      <LMCard loading title="Loading Card">
        This content should not show
      </LMCard>
    )
    expect(screen.queryByText('This content should not show')).not.toBeInTheDocument()
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('applies hoverable class when hoverable prop is true', () => {
    const { container } = render(<LMCard hoverable>Content</LMCard>)
    expect(container.firstChild).toHaveClass('cursor-pointer')
  })

  it('does not apply hoverable class when hoverable prop is false', () => {
    const { container } = render(<LMCard hoverable={false}>Content</LMCard>)
    expect(container.firstChild).not.toHaveClass('cursor-pointer')
  })

  it('applies border class when bordered prop is true', () => {
    const { container } = render(<LMCard bordered>Content</LMCard>)
    expect(container.firstChild).toHaveClass('border')
  })

  it('does not apply border class when bordered prop is false', () => {
    const { container } = render(<LMCard bordered={false}>Content</LMCard>)
    expect(container.firstChild).not.toHaveClass('border')
  })

  it('applies custom className', () => {
    const { container } = render(<LMCard className="custom-class">Content</LMCard>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('handles mouse enter and leave for hoverable cards', () => {
    const { container } = render(<LMCard hoverable>Content</LMCard>)
    const card = container.firstChild as HTMLElement

    fireEvent.mouseEnter(card)
    // Check that transform is applied on hover
    expect(card.style.transform).toBe('translateY(-2px)')

    fireEvent.mouseLeave(card)
    // Check that transform is removed on leave
    expect(card.style.transform).toBe('')
  })

  it('renders different sizes correctly', () => {
    const { rerender } = render(<LMCard size="xs">Content</LMCard>)
    expect(screen.getByText('Content')).toBeInTheDocument()

    rerender(<LMCard size="lg">Content</LMCard>)
    expect(screen.getByText('Content')).toBeInTheDocument()

    rerender(<LMCard size="2xl">Content</LMCard>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders different variants correctly', () => {
    const { container, rerender } = render(<LMCard variant="default">Content</LMCard>)
    expect(container.firstChild).toBeInTheDocument()

    rerender(<LMCard variant="elevated">Content</LMCard>)
    expect(container.firstChild).toBeInTheDocument()

    rerender(<LMCard variant="outline">Content</LMCard>)
    expect(container.firstChild).toBeInTheDocument()

    rerender(<LMCard variant="soft">Content</LMCard>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('passes additional props to the container', () => {
    const handleClick = vi.fn()
    const { container } = render(
      <LMCard data-testid="custom-card" onClick={handleClick}>
        Content
      </LMCard>
    )

    expect(screen.getByTestId('custom-card')).toBeInTheDocument()

    fireEvent.click(container.firstChild as HTMLElement)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
