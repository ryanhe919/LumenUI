import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LMEmpty from './LMEmpty'

describe('LMEmpty', () => {
  it('renders with default description', () => {
    render(<LMEmpty />)
    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })

  it('renders custom description', () => {
    render(<LMEmpty description="No results found" />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('renders children when provided', () => {
    render(
      <LMEmpty>
        <button>Add Item</button>
      </LMEmpty>
    )
    expect(screen.getByText('Add Item')).toBeInTheDocument()
  })

  it('renders default image by default', () => {
    const { container } = render(<LMEmpty />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders simple image when specified', () => {
    const { container } = render(<LMEmpty image="simple" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders custom image when provided', () => {
    render(<LMEmpty image={<img src="test.jpg" alt="Custom" />} />)
    expect(screen.getByAltText('Custom')).toBeInTheDocument()
  })

  it('hides image when image is null', () => {
    const { container } = render(<LMEmpty image={null} />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('hides description when description is null', () => {
    render(<LMEmpty description={null} />)
    expect(screen.queryByText('暂无数据')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<LMEmpty className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('applies custom image style', () => {
    const { container } = render(
      <LMEmpty imageStyle={{ opacity: 0.5 }} />
    )
    const imageContainer = container.querySelector('.mb-4')
    expect(imageContainer).toHaveStyle({ opacity: '0.5' })
  })

  it('renders different sizes', () => {
    const { container, rerender } = render(<LMEmpty size="xs" />)
    expect(container.firstChild).toHaveClass('py-4')

    rerender(<LMEmpty size="lg" />)
    expect(container.firstChild).toHaveClass('py-10')

    rerender(<LMEmpty size="2xl" />)
    expect(container.firstChild).toHaveClass('py-16')
  })

  it('passes additional props to container', () => {
    render(<LMEmpty data-testid="empty-state" />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('renders ReactNode as description', () => {
    render(
      <LMEmpty
        description={
          <span>
            Custom <strong>styled</strong> description
          </span>
        }
      />
    )
    expect(screen.getByText('styled')).toBeInTheDocument()
  })
})
