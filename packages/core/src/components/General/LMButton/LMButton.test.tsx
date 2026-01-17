import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMButton from './LMButton'

describe('LMButton', () => {
  it('renders children correctly', () => {
    render(<LMButton>Click me</LMButton>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<LMButton onClick={handleClick}>Click me</LMButton>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables the button when disabled prop is true', () => {
    render(<LMButton disabled>Disabled</LMButton>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('disables the button when loading prop is true', () => {
    render(<LMButton loading>Loading</LMButton>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading text when loading', () => {
    render(<LMButton loading loadingText="Submitting...">Submit</LMButton>)
    expect(screen.getByRole('button')).toHaveTextContent('Submitting...')
  })

  it('renders left icon', () => {
    render(
      <LMButton leftIcon={<span data-testid="left-icon">L</span>}>
        With Icon
      </LMButton>
    )
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders right icon', () => {
    render(
      <LMButton rightIcon={<span data-testid="right-icon">R</span>}>
        With Icon
      </LMButton>
    )
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('applies fullWidth class when fullWidth is true', () => {
    render(<LMButton fullWidth>Full Width</LMButton>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })

  it('applies rounded-full class when rounded is true', () => {
    render(<LMButton rounded>Rounded</LMButton>)
    expect(screen.getByRole('button')).toHaveClass('rounded-full')
  })

  it('applies custom className', () => {
    render(<LMButton className="custom-class">Custom</LMButton>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('does not trigger click when disabled', () => {
    const handleClick = vi.fn()
    render(<LMButton disabled onClick={handleClick}>Disabled</LMButton>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not trigger click when loading', () => {
    const handleClick = vi.fn()
    render(<LMButton loading onClick={handleClick}>Loading</LMButton>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
