import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMNumberInput from './LMNumberInput'

describe('LMNumberInput', () => {
  it('renders with placeholder', () => {
    render(<LMNumberInput placeholder="Enter number" />)
    expect(screen.getByPlaceholderText('Enter number')).toBeInTheDocument()
  })

  it('renders with value', () => {
    render(<LMNumberInput value={42} onChange={() => {}} />)
    expect(screen.getByDisplayValue('42')).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn()
    render(<LMNumberInput value={0} onChange={handleChange} />)

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '10' } })
    expect(handleChange).toHaveBeenCalledWith(10)
  })

  it('disables the input when disabled prop is true', () => {
    render(<LMNumberInput disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('displays error message when error is true', () => {
    render(
      <LMNumberInput
        error
        errorMessage="Invalid number"
      />
    )
    expect(screen.getByText('Invalid number')).toBeInTheDocument()
  })

  it('renders increment and decrement buttons when showControls is true', () => {
    render(<LMNumberInput showControls />)
    expect(screen.getByLabelText('Increment')).toBeInTheDocument()
    expect(screen.getByLabelText('Decrement')).toBeInTheDocument()
  })

  it('does not render controls when showControls is false', () => {
    render(<LMNumberInput showControls={false} />)
    expect(screen.queryByLabelText('Increment')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Decrement')).not.toBeInTheDocument()
  })

  it('increments value when clicking increment button', () => {
    const handleChange = vi.fn()
    render(<LMNumberInput value={5} onChange={handleChange} />)

    fireEvent.click(screen.getByLabelText('Increment'))
    expect(handleChange).toHaveBeenCalledWith(6)
  })

  it('decrements value when clicking decrement button', () => {
    const handleChange = vi.fn()
    render(<LMNumberInput value={5} onChange={handleChange} />)

    fireEvent.click(screen.getByLabelText('Decrement'))
    expect(handleChange).toHaveBeenCalledWith(4)
  })

  it('respects min value', () => {
    const handleChange = vi.fn()
    render(<LMNumberInput value={0} onChange={handleChange} min={0} />)

    fireEvent.click(screen.getByLabelText('Decrement'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('respects max value', () => {
    const handleChange = vi.fn()
    render(<LMNumberInput value={10} onChange={handleChange} max={10} />)

    fireEvent.click(screen.getByLabelText('Increment'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('uses custom step value', () => {
    const handleChange = vi.fn()
    render(<LMNumberInput value={0} onChange={handleChange} step={5} />)

    fireEvent.click(screen.getByLabelText('Increment'))
    expect(handleChange).toHaveBeenCalledWith(5)
  })

  it('renders prefix', () => {
    render(<LMNumberInput prefix="$" />)
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('renders suffix', () => {
    render(<LMNumberInput suffix="%" />)
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is true', () => {
    render(<LMNumberInput error />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true')
  })
})
