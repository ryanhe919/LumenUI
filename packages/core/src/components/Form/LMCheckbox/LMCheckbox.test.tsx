import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMCheckbox from './LMCheckbox'

describe('LMCheckbox', () => {
  it('renders with label', () => {
    render(<LMCheckbox label="Accept terms" />)
    expect(screen.getByText('Accept terms')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(<LMCheckbox label="Newsletter" description="Get weekly updates" />)
    expect(screen.getByText('Get weekly updates')).toBeInTheDocument()
  })

  it('handles change events', () => {
    const handleChange = vi.fn()
    render(<LMCheckbox label="Test" onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be checked and unchecked', () => {
    render(<LMCheckbox label="Test" />)
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement

    expect(checkbox.checked).toBe(false)
    fireEvent.click(checkbox)
    expect(checkbox.checked).toBe(true)
    fireEvent.click(checkbox)
    expect(checkbox.checked).toBe(false)
  })

  it('disables the checkbox when disabled prop is true', () => {
    render(<LMCheckbox label="Disabled" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('displays error message when error is true', () => {
    render(
      <LMCheckbox
        label="Terms"
        error
        errorMessage="You must accept the terms"
      />
    )
    expect(screen.getByText('You must accept the terms')).toBeInTheDocument()
  })

  it('does not trigger change when disabled', () => {
    const handleChange = vi.fn()
    render(<LMCheckbox label="Disabled" disabled onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox')
    // Verify checkbox is disabled
    expect(checkbox).toBeDisabled()
    // fireEvent.change with disabled input should not trigger handler
    fireEvent.change(checkbox, { target: { checked: true } })
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<LMCheckbox label="Custom" className="custom-class" />)
    expect(screen.getByRole('checkbox')).toHaveClass('custom-class')
  })

  it('renders with controlled checked state', () => {
    render(<LMCheckbox label="Controlled" checked onChange={() => { }} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
