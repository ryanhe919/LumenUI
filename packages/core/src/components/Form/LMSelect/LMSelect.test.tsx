import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import LMSelect from './LMSelect'

const defaultOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
]

// Helper to get visible dropdown options (excluding hidden native select options)
const getVisibleOptions = () => {
  const options = screen.getAllByRole('option')
  // Filter out native select options (they are inside a .sr-only element)
  return options.filter((option) => !option.closest('.sr-only'))
}

describe('LMSelect', () => {
  it('renders with placeholder', () => {
    render(<LMSelect options={defaultOptions} placeholder="Select..." />)
    expect(screen.getByText('Select...')).toBeInTheDocument()
  })

  it('renders with value', () => {
    render(<LMSelect options={defaultOptions} value="react" />)
    const button = screen.getByRole('button')
    expect(within(button).getByText('React')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', () => {
    render(<LMSelect options={defaultOptions} placeholder="Select..." />)

    fireEvent.click(screen.getByRole('button'))

    const options = getVisibleOptions()
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('React')
    expect(options[1]).toHaveTextContent('Vue')
    expect(options[2]).toHaveTextContent('Angular')
  })

  it('calls onChange when option is selected', () => {
    const handleChange = vi.fn()
    render(
      <LMSelect
        options={defaultOptions}
        onChange={handleChange}
        placeholder="Select..."
      />
    )

    fireEvent.click(screen.getByRole('button'))
    const options = getVisibleOptions()
    fireEvent.click(options[1]) // Vue

    expect(handleChange).toHaveBeenCalledWith('vue')
  })

  it('closes dropdown after selection in single mode', () => {
    render(<LMSelect options={defaultOptions} placeholder="Select..." />)

    fireEvent.click(screen.getByRole('button'))
    const options = getVisibleOptions()
    fireEvent.click(options[1]) // Vue

    // After selection, only native hidden options should remain
    const remainingOptions = getVisibleOptions()
    expect(remainingOptions).toHaveLength(0)
  })

  it('disables the select when disabled prop is true', () => {
    render(<LMSelect options={defaultOptions} disabled placeholder="Select..." />)
    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1')
  })

  it('does not open dropdown when disabled', () => {
    render(<LMSelect options={defaultOptions} disabled placeholder="Select..." />)

    fireEvent.click(screen.getByRole('button'))

    const options = getVisibleOptions()
    expect(options).toHaveLength(0)
  })

  it('renders disabled options with cursor-not-allowed', () => {
    const optionsWithDisabled = [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue', disabled: true },
    ]
    render(<LMSelect options={optionsWithDisabled} placeholder="Select..." />)

    fireEvent.click(screen.getByRole('button'))

    const options = getVisibleOptions()
    // Check that the disabled option has cursor-not-allowed class
    expect(options[1].className).toContain('cursor-not-allowed')
  })

  it('displays error message when error is true', () => {
    render(
      <LMSelect
        options={defaultOptions}
        error
        errorMessage="Please select an option"
        placeholder="Select..."
      />
    )
    expect(screen.getByText('Please select an option')).toBeInTheDocument()
  })

  it('handles multiple selection', () => {
    const handleChange = vi.fn()
    render(
      <LMSelect
        options={defaultOptions}
        onChange={handleChange}
        multiple
        value={[]}
        placeholder="Select..."
      />
    )

    fireEvent.click(screen.getByRole('button'))
    const options = getVisibleOptions()
    fireEvent.click(options[0]) // React

    expect(handleChange).toHaveBeenCalledWith(['react'])
  })

  it('shows count when multiple items are selected', () => {
    render(
      <LMSelect
        options={defaultOptions}
        multiple
        value={['react', 'vue']}
        placeholder="Select..."
      />
    )
    expect(screen.getByText('2 selected')).toBeInTheDocument()
  })

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <LMSelect options={defaultOptions} placeholder="Select..." />
        <div data-testid="outside">Outside</div>
      </div>
    )

    fireEvent.click(screen.getByRole('button'))
    expect(getVisibleOptions()).toHaveLength(3)

    fireEvent.mouseDown(screen.getByTestId('outside'))
    expect(getVisibleOptions()).toHaveLength(0)
  })

  it('calls onDropdownVisibleChange when dropdown opens', () => {
    const handleDropdownVisibleChange = vi.fn()
    render(
      <LMSelect
        options={defaultOptions}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        placeholder="Select..."
      />
    )

    fireEvent.click(screen.getByRole('button'))
    expect(handleDropdownVisibleChange).toHaveBeenCalledWith(true)
  })

  it('calls onDropdownVisibleChange when dropdown closes', () => {
    const handleDropdownVisibleChange = vi.fn()
    render(
      <div>
        <LMSelect
          options={defaultOptions}
          onDropdownVisibleChange={handleDropdownVisibleChange}
          placeholder="Select..."
        />
        <div data-testid="outside">Outside</div>
      </div>
    )

    fireEvent.click(screen.getByRole('button'))
    expect(handleDropdownVisibleChange).toHaveBeenCalledWith(true)

    fireEvent.mouseDown(screen.getByTestId('outside'))
    expect(handleDropdownVisibleChange).toHaveBeenCalledWith(false)
  })
})
