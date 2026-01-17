import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LMPagination from './LMPagination'

describe('LMPagination', () => {
  it('renders page numbers correctly', () => {
    render(<LMPagination current={1} total={100} pageSize={10} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('highlights current page', () => {
    render(<LMPagination current={5} total={100} pageSize={10} />)
    const currentButton = screen.getByText('5')
    expect(currentButton).toHaveAttribute('aria-current', 'page')
  })

  it('calls onChange when page is clicked', () => {
    const handleChange = vi.fn()
    render(<LMPagination current={1} total={100} pageSize={10} onChange={handleChange} />)

    fireEvent.click(screen.getByText('2'))
    expect(handleChange).toHaveBeenCalledWith(2, 10)
  })

  it('navigates to previous page', () => {
    const handleChange = vi.fn()
    render(<LMPagination current={5} total={100} pageSize={10} onChange={handleChange} />)

    fireEvent.click(screen.getByLabelText('上一页'))
    expect(handleChange).toHaveBeenCalledWith(4, 10)
  })

  it('navigates to next page', () => {
    const handleChange = vi.fn()
    render(<LMPagination current={5} total={100} pageSize={10} onChange={handleChange} />)

    fireEvent.click(screen.getByLabelText('下一页'))
    expect(handleChange).toHaveBeenCalledWith(6, 10)
  })

  it('disables previous button on first page', () => {
    render(<LMPagination current={1} total={100} pageSize={10} />)
    expect(screen.getByLabelText('上一页')).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<LMPagination current={10} total={100} pageSize={10} />)
    expect(screen.getByLabelText('下一页')).toBeDisabled()
  })

  it('renders simple mode correctly', () => {
    render(<LMPagination current={5} total={100} pageSize={10} simple />)
    expect(screen.getByText('5 / 10')).toBeInTheDocument()
    // Should not show individual page numbers
    expect(screen.queryByText('3')).not.toBeInTheDocument()
  })

  it('shows total count when showTotal is true', () => {
    render(<LMPagination current={1} total={256} pageSize={10} showTotal />)
    expect(screen.getByText('共 256 条')).toBeInTheDocument()
  })

  it('shows custom total format', () => {
    render(
      <LMPagination
        current={2}
        total={100}
        pageSize={10}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total}`}
      />
    )
    expect(screen.getByText('11-20 of 100')).toBeInTheDocument()
  })

  it('renders size changer when showSizeChanger is true', () => {
    render(
      <LMPagination
        current={1}
        total={100}
        pageSize={10}
        showSizeChanger
        pageSizeOptions={[10, 20, 50]}
      />
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('changes page size', () => {
    const handleChange = vi.fn()
    render(
      <LMPagination
        current={1}
        total={100}
        pageSize={10}
        showSizeChanger
        onChange={handleChange}
      />
    )

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '20' } })
    expect(handleChange).toHaveBeenCalledWith(1, 20)
  })

  it('renders quick jumper when showQuickJumper is true', () => {
    render(<LMPagination current={1} total={100} pageSize={10} showQuickJumper />)
    expect(screen.getByText('跳至')).toBeInTheDocument()
    expect(screen.getByText('页')).toBeInTheDocument()
  })

  it('jumps to page on enter', () => {
    const handleChange = vi.fn()
    render(
      <LMPagination
        current={1}
        total={100}
        pageSize={10}
        showQuickJumper
        onChange={handleChange}
      />
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(handleChange).toHaveBeenCalledWith(5, 10)
  })

  it('disables all interactions when disabled', () => {
    render(<LMPagination current={5} total={100} pageSize={10} disabled />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })

  it('renders different sizes', () => {
    const { rerender } = render(<LMPagination current={1} total={100} size="xs" />)
    expect(screen.getByText('1')).toBeInTheDocument()

    rerender(<LMPagination current={1} total={100} size="lg" />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('handles few pages correctly', () => {
    render(<LMPagination current={1} total={30} pageSize={10} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not call onChange for current page click', () => {
    const handleChange = vi.fn()
    render(<LMPagination current={5} total={100} pageSize={10} onChange={handleChange} />)

    fireEvent.click(screen.getByText('5'))
    expect(handleChange).not.toHaveBeenCalled()
  })
})
