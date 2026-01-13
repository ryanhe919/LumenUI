import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMTooltip from './LMTooltip'

describe('LMTooltip', () => {
  it('renders children', () => {
    render(
      <LMTooltip content="Tooltip text">
        <button>Trigger</button>
      </LMTooltip>
    )
    expect(screen.getByText('Trigger')).toBeInTheDocument()
  })

  it('does not show tooltip by default', () => {
    render(
      <LMTooltip content="Tooltip text">
        <button>Trigger</button>
      </LMTooltip>
    )
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()
  })

  it('shows tooltip on mouse enter', () => {
    render(
      <LMTooltip content="Tooltip text">
        <button>Trigger</button>
      </LMTooltip>
    )

    const trigger = screen.getByText('Trigger').parentElement
    fireEvent.mouseEnter(trigger!)

    expect(screen.getByText('Tooltip text')).toBeInTheDocument()
  })

  it('hides tooltip on mouse leave', () => {
    render(
      <LMTooltip content="Tooltip text">
        <button>Trigger</button>
      </LMTooltip>
    )

    const trigger = screen.getByText('Trigger').parentElement
    fireEvent.mouseEnter(trigger!)
    expect(screen.getByText('Tooltip text')).toBeInTheDocument()

    fireEvent.mouseLeave(trigger!)
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument()
  })

  it('renders with React node as content', () => {
    render(
      <LMTooltip content={<span data-testid="custom-content">Custom</span>}>
        <button>Trigger</button>
      </LMTooltip>
    )

    const trigger = screen.getByText('Trigger').parentElement
    fireEvent.mouseEnter(trigger!)

    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
  })

  it('applies maxWidth when provided', () => {
    render(
      <LMTooltip content="Tooltip text" maxWidth={200}>
        <button>Trigger</button>
      </LMTooltip>
    )

    const trigger = screen.getByText('Trigger').parentElement
    fireEvent.mouseEnter(trigger!)

    const tooltip = screen.getByText('Tooltip text')
    expect(tooltip).toHaveStyle({ maxWidth: '200px' })
  })
})
