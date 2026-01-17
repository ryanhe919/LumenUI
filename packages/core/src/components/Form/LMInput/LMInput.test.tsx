import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMInput from './LMInput'

describe('LMInput', () => {
  it('renders with placeholder', () => {
    render(<LMInput placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders with value', () => {
    render(<LMInput value="test value" onChange={() => {}} />)
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })

  it('handles change events', () => {
    const handleChange = vi.fn()
    render(<LMInput onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('disables the input when disabled prop is true', () => {
    render(<LMInput disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('renders left icon', () => {
    render(
      <LMInput
        leftIcon={<span data-testid="left-icon">L</span>}
        placeholder="With icon"
      />
    )
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders right element', () => {
    render(
      <LMInput
        rightElement={<span data-testid="right-element">R</span>}
        placeholder="With element"
      />
    )
    expect(screen.getByTestId('right-element')).toBeInTheDocument()
  })

  it('displays error message when error is true', () => {
    render(
      <LMInput
        error
        errorMessage="This field is required"
        placeholder="Error input"
      />
    )
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is true', () => {
    render(<LMInput error placeholder="Error" />)
    expect(screen.getByPlaceholderText('Error')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders with different input types', () => {
    render(<LMInput type="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')
  })

  it('renders time input with seconds when includeSeconds is true', () => {
    render(<LMInput type="time" includeSeconds />)
    const input = document.querySelector('input[type="time"]')
    expect(input).toHaveAttribute('step', '1')
  })

  it('applies custom className', () => {
    render(<LMInput className="custom-class" placeholder="Custom" />)
    expect(screen.getByPlaceholderText('Custom')).toHaveClass('custom-class')
  })
})
