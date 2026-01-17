import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMRadio from './LMRadio'

describe('LMRadio', () => {
  it('renders with label', () => {
    render(<LMRadio label="Option A" name="test" />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
  })

  it('renders with description', () => {
    render(<LMRadio label="Option" description="Description text" name="test" />)
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('handles change events', () => {
    const handleChange = vi.fn()
    render(<LMRadio label="Test" name="test" onChange={handleChange} />)

    const radio = screen.getByRole('radio')
    fireEvent.click(radio)
    expect(handleChange).toHaveBeenCalled()
  })

  it('can be selected', () => {
    render(<LMRadio label="Test" name="test" />)
    const radio = screen.getByRole('radio') as HTMLInputElement

    expect(radio.checked).toBe(false)
    fireEvent.click(radio)
    expect(radio.checked).toBe(true)
  })

  it('disables the radio when disabled prop is true', () => {
    render(<LMRadio label="Disabled" name="test" disabled />)
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('displays error message when error is true', () => {
    render(
      <LMRadio
        label="Option"
        name="test"
        error
        errorMessage="Please select an option"
      />
    )
    expect(screen.getByText('Please select an option')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is true', () => {
    render(<LMRadio label="Error" name="test" error />)
    expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not trigger change when disabled', () => {
    const handleChange = vi.fn()
    render(<LMRadio label="Disabled" name="test" disabled onChange={handleChange} />)

    const radio = screen.getByRole('radio')
    // Verify radio is disabled
    expect(radio).toBeDisabled()
    // fireEvent.change with disabled input should not trigger handler
    fireEvent.change(radio, { target: { checked: true } })
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('renders with controlled checked state', () => {
    render(<LMRadio label="Controlled" name="test" checked onChange={() => {}} />)
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('applies custom className', () => {
    render(<LMRadio label="Custom" name="test" className="custom-class" />)
    expect(screen.getByRole('radio')).toHaveClass('custom-class')
  })

  it('groups radios by name', () => {
    render(
      <>
        <LMRadio label="Option 1" name="group" value="1" />
        <LMRadio label="Option 2" name="group" value="2" />
      </>
    )
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(2)
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'group')
    })
  })
})
