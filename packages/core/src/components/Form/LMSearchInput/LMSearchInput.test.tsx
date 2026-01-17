import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LMSearchInput from './LMSearchInput'

describe('LMSearchInput', () => {
  it('renders with placeholder', () => {
    render(<LMSearchInput placeholder="Search..." />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('renders with value', () => {
    render(<LMSearchInput value="test" onChange={() => {}} />)
    expect(screen.getByDisplayValue('test')).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn()
    render(<LMSearchInput onChange={handleChange} />)

    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledWith('new value')
  })

  it('disables the input when disabled prop is true', () => {
    render(<LMSearchInput disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('displays error message when error is true', () => {
    render(
      <LMSearchInput
        error
        errorMessage="Search term is required"
      />
    )
    expect(screen.getByText('Search term is required')).toBeInTheDocument()
  })

  it('renders search button when showSearchButton is true', () => {
    render(<LMSearchInput showSearchButton searchButtonText="Search" />)
    expect(screen.getByText('Search')).toBeInTheDocument()
  })

  it('does not render search button when showSearchButton is false', () => {
    render(<LMSearchInput showSearchButton={false} searchButtonText="Search" />)
    expect(screen.queryByText('Search')).not.toBeInTheDocument()
  })

  it('renders clear button when showClear is true and has value', () => {
    render(<LMSearchInput value="test" onChange={() => {}} showClear />)
    expect(screen.getByLabelText('Clear')).toBeInTheDocument()
  })

  it('does not render clear button when value is empty', () => {
    render(<LMSearchInput value="" onChange={() => {}} showClear />)
    expect(screen.queryByLabelText('Clear')).not.toBeInTheDocument()
  })

  it('clears value when clear button is clicked', () => {
    const handleChange = vi.fn()
    const handleSearch = vi.fn()
    render(
      <LMSearchInput
        value="test"
        onChange={handleChange}
        onSearch={handleSearch}
        showClear
      />
    )

    fireEvent.click(screen.getByLabelText('Clear'))
    expect(handleChange).toHaveBeenCalledWith('')
    expect(handleSearch).toHaveBeenCalledWith('')
  })

  it('calls onSearch when search button is clicked', () => {
    const handleSearch = vi.fn()
    render(
      <LMSearchInput
        value="test query"
        onChange={() => {}}
        onSearch={handleSearch}
        showSearchButton
      />
    )

    fireEvent.click(screen.getByText('Search'))
    expect(handleSearch).toHaveBeenCalledWith('test query')
  })

  it('calls onSearch when Enter is pressed', () => {
    const handleSearch = vi.fn()
    render(
      <LMSearchInput
        value="test"
        onChange={() => {}}
        onSearch={handleSearch}
      />
    )

    const input = screen.getByRole('searchbox')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(handleSearch).toHaveBeenCalledWith('test')
  })

  it('uses custom search button text', () => {
    render(<LMSearchInput searchButtonText="Find" showSearchButton />)
    expect(screen.getByText('Find')).toBeInTheDocument()
  })
})
