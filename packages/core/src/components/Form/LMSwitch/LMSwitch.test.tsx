import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMSwitch from './LMSwitch'

describe('LMSwitch', () => {
  it('renders with label', () => {
    render(<LMSwitch label="Enable feature" />)
    expect(screen.getByText('Enable feature')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(<LMSwitch label="Dark mode" description="Enable dark theme" />)
    expect(screen.getByText('Enable dark theme')).toBeInTheDocument()
  })

  it('renders without label', () => {
    render(<LMSwitch aria-label="Toggle" />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('handles change events', () => {
    const handleChange = vi.fn()
    render(<LMSwitch label="Test" onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be toggled', () => {
    render(<LMSwitch label="Test" />)
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement

    expect(checkbox.checked).toBe(false)
    fireEvent.click(checkbox)
    expect(checkbox.checked).toBe(true)
  })

  it('disables the switch when disabled prop is true', () => {
    render(<LMSwitch label="Disabled" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('displays error message when error is true', () => {
    render(
      <LMSwitch
        label="Feature"
        error
        errorMessage="Premium required"
      />
    )
    expect(screen.getByText('Premium required')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is true', () => {
    render(<LMSwitch label="Error" error />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not trigger change when disabled', () => {
    const handleChange = vi.fn()
    render(<LMSwitch label="Disabled" disabled onChange={handleChange} />)

    const checkbox = screen.getByRole('checkbox')
    // Verify checkbox is disabled
    expect(checkbox).toBeDisabled()
    // fireEvent.change with disabled input should not trigger handler
    fireEvent.change(checkbox, { target: { checked: true } })
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('renders with controlled checked state', () => {
    render(<LMSwitch label="Controlled" checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('associates label with input via htmlFor', () => {
    render(<LMSwitch label="Labeled" id="my-switch" />)
    const label = screen.getByText('Labeled').closest('label')
    expect(label).toHaveAttribute('for', 'my-switch')
  })
})
