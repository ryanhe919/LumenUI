import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMTextarea from './LMTextarea'

describe('LMTextarea', () => {
  it('renders with placeholder', () => {
    render(<LMTextarea placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders with value', () => {
    render(<LMTextarea value="test value" onChange={() => {}} />)
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })

  it('handles change events', () => {
    const handleChange = vi.fn()
    render(<LMTextarea onChange={handleChange} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('disables the textarea when disabled prop is true', () => {
    render(<LMTextarea disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('displays error message when error is true', () => {
    render(
      <LMTextarea
        error
        errorMessage="This field is required"
        placeholder="Error textarea"
      />
    )
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<LMTextarea className="custom-class" placeholder="Custom" />)
    expect(screen.getByPlaceholderText('Custom')).toHaveClass('custom-class')
  })

  it('renders with rows attribute', () => {
    render(<LMTextarea rows={5} placeholder="With rows" />)
    expect(screen.getByPlaceholderText('With rows')).toHaveAttribute('rows', '5')
  })

  it('renders with maxLength attribute', () => {
    render(<LMTextarea maxLength={100} placeholder="With maxLength" />)
    expect(screen.getByPlaceholderText('With maxLength')).toHaveAttribute('maxLength', '100')
  })
})
