import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LMField from './LMField'

describe('LMField', () => {
  it('renders with label', () => {
    render(
      <LMField label="Email">
        <input type="email" />
      </LMField>
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <LMField label="Name">
        <input data-testid="child-input" />
      </LMField>
    )
    expect(screen.getByTestId('child-input')).toBeInTheDocument()
  })

  it('shows required indicator when required is true', () => {
    render(
      <LMField label="Username" required>
        <input />
      </LMField>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('does not show required indicator when required is false', () => {
    render(
      <LMField label="Username">
        <input />
      </LMField>
    )
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('renders help text', () => {
    render(
      <LMField label="Password" help="Must be 8 characters">
        <input type="password" />
      </LMField>
    )
    expect(screen.getByText('Must be 8 characters')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(
      <LMField label="Email" errorMessage="Invalid email">
        <input type="email" />
      </LMField>
    )
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('associates label with child input via htmlFor when id is provided', () => {
    render(
      <LMField label="Email">
        <input id="email-input" />
      </LMField>
    )
    const label = screen.getByText('Email')
    expect(label).toHaveAttribute('for', 'email-input')
  })

  it('sets aria-required on label when required', () => {
    render(
      <LMField label="Username" required>
        <input />
      </LMField>
    )
    const label = screen.getByText(/Username/)
    expect(label.closest('label')).toHaveAttribute('aria-required', 'true')
  })

  it('applies custom className', () => {
    const { container } = render(
      <LMField label="Test" className="custom-class">
        <input />
      </LMField>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
