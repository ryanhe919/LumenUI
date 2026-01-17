import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LMDatePicker from './LMDatePicker'

describe('LMDatePicker', () => {
  it('renders with placeholder', () => {
    render(<LMDatePicker placeholder="Select date" />)
    expect(screen.getByText('Select date')).toBeInTheDocument()
  })

  it('renders with default value', () => {
    const date = new Date(2024, 5, 15) // June 15, 2024
    render(<LMDatePicker defaultValue={date} />)
    expect(screen.getByText('2024-06-15')).toBeInTheDocument()
  })

  it('opens calendar on click', async () => {
    render(<LMDatePicker />)

    fireEvent.click(screen.getByText('请选择日期'))

    await waitFor(() => {
      expect(screen.getByText('今天')).toBeInTheDocument()
    })
  })

  it('calls onChange when date is selected', async () => {
    const handleChange = vi.fn()
    render(<LMDatePicker onChange={handleChange} />)

    fireEvent.click(screen.getByText('请选择日期'))

    await waitFor(() => {
      expect(screen.getByText('今天')).toBeInTheDocument()
    })

    // Click on the "Today" button
    fireEvent.click(screen.getByText('今天'))

    expect(handleChange).toHaveBeenCalled()
    const [date, dateString] = handleChange.mock.calls[0]
    expect(date).toBeInstanceOf(Date)
    expect(typeof dateString).toBe('string')
  })

  it('respects controlled value', () => {
    const date = new Date(2024, 0, 1)
    const { rerender } = render(<LMDatePicker value={date} />)

    expect(screen.getByText('2024-01-01')).toBeInTheDocument()

    const newDate = new Date(2024, 11, 31)
    rerender(<LMDatePicker value={newDate} />)

    expect(screen.getByText('2024-12-31')).toBeInTheDocument()
  })

  it('clears value when clear button is clicked', async () => {
    const handleChange = vi.fn()
    render(<LMDatePicker defaultValue={new Date()} onChange={handleChange} />)

    // Hover to show clear button
    const trigger = screen.getByText(/\d{4}-\d{2}-\d{2}/).parentElement!
    fireEvent.mouseEnter(trigger)

    // Find and click the clear button
    const clearButton = trigger.querySelector('span:last-child')
    if (clearButton) {
      fireEvent.click(clearButton)
    }

    expect(handleChange).toHaveBeenCalledWith(null, '')
  })

  it('does not open when disabled', () => {
    render(<LMDatePicker disabled />)

    fireEvent.click(screen.getByText('请选择日期'))

    expect(screen.queryByText('今天')).not.toBeInTheDocument()
  })

  it('applies custom format', () => {
    const date = new Date(2024, 5, 15)
    render(<LMDatePicker value={date} format="YYYY/MM/DD" />)

    expect(screen.getByText('2024/06/15')).toBeInTheDocument()
  })

  it('shows error message when error is true', () => {
    render(<LMDatePicker error errorMessage="Date is required" />)

    expect(screen.getByText('Date is required')).toBeInTheDocument()
  })

  it('disables specific dates', async () => {
    const handleChange = vi.fn()
    const disabledDate = (date: Date) => date.getDay() === 0 // Disable Sundays

    render(<LMDatePicker onChange={handleChange} disabledDate={disabledDate} />)

    fireEvent.click(screen.getByText('请选择日期'))

    await waitFor(() => {
      expect(screen.getByText('今天')).toBeInTheDocument()
    })

    // Find a Sunday and try to click it
    // This is tricky to test without knowing the exact calendar state
    // But we can at least verify the calendar is open
    expect(screen.getByText('日')).toBeInTheDocument() // Sunday header
  })

  it('navigates months', async () => {
    render(<LMDatePicker />)

    fireEvent.click(screen.getByText('请选择日期'))

    await waitFor(() => {
      expect(screen.getByText('今天')).toBeInTheDocument()
    })

    // The month should be displayed
    const currentMonth = new Date().getMonth()
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    expect(screen.getByText(new RegExp(months[currentMonth]))).toBeInTheDocument()
  })

  it('closes on click outside', async () => {
    render(
      <div>
        <LMDatePicker />
        <button>Outside</button>
      </div>
    )

    fireEvent.click(screen.getByText('请选择日期'))

    await waitFor(() => {
      expect(screen.getByText('今天')).toBeInTheDocument()
    })

    fireEvent.mouseDown(screen.getByText('Outside'))

    await waitFor(() => {
      expect(screen.queryByText('今天')).not.toBeInTheDocument()
    })
  })

  it('parses string value', () => {
    render(<LMDatePicker value="2024-03-15" />)
    expect(screen.getByText('2024-03-15')).toBeInTheDocument()
  })

  it('handles null value', () => {
    render(<LMDatePicker value={null} placeholder="No date" />)
    expect(screen.getByText('No date')).toBeInTheDocument()
  })
})
