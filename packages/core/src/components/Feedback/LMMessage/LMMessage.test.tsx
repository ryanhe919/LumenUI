import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import LMMessage, { LMMessageContainer } from './LMMessage'
import { useMessage } from '../../../hooks/useMessage'

describe('LMMessage', () => {
  it('renders content', () => {
    render(
      <LMMessage
        id="1"
        type="info"
        content="This is a message"
        onClose={vi.fn()}
        duration={0}
      />
    )
    expect(screen.getByText('This is a message')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(
      <LMMessage
        id="1"
        type="success"
        title="Success"
        content="Operation completed"
        onClose={vi.fn()}
        duration={0}
      />
    )
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Operation completed')).toBeInTheDocument()
  })

  it('renders success message with correct aria-label', () => {
    render(
      <LMMessage
        id="1"
        type="success"
        content="Success"
        onClose={vi.fn()}
        duration={0}
      />
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Success message')
  })

  it('renders error message with correct aria-label', () => {
    render(
      <LMMessage
        id="1"
        type="error"
        content="Error"
        onClose={vi.fn()}
        duration={0}
      />
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Error message')
  })

  it('renders warning message with correct aria-label', () => {
    render(
      <LMMessage
        id="1"
        type="warning"
        content="Warning"
        onClose={vi.fn()}
        duration={0}
      />
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Warning message')
  })

  it('renders info message with correct aria-label', () => {
    render(
      <LMMessage
        id="1"
        type="info"
        content="Info"
        onClose={vi.fn()}
        duration={0}
      />
    )
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Information message')
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <LMMessage
        id="test-id"
        type="info"
        content="Test message"
        onClose={handleClose}
        duration={0}
      />
    )

    const closeButton = screen.getByLabelText('Close message')
    fireEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalledWith('test-id')
  })

  it('auto-closes after duration', async () => {
    vi.useFakeTimers()
    const handleClose = vi.fn()

    render(
      <LMMessage
        id="test-id"
        type="info"
        content="Test message"
        onClose={handleClose}
        duration={2000}
      />
    )

    expect(handleClose).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(handleClose).toHaveBeenCalledWith('test-id')
    vi.useRealTimers()
  })

  it('does not auto-close when duration is 0', async () => {
    vi.useFakeTimers()
    const handleClose = vi.fn()

    render(
      <LMMessage
        id="test-id"
        type="info"
        content="Test message"
        onClose={handleClose}
        duration={0}
      />
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(handleClose).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})

describe('LMMessageContainer', () => {
  it('renders nothing when messages array is empty', () => {
    const { container } = render(
      <LMMessageContainer messages={[]} onClose={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders all messages', () => {
    const messages = [
      { id: '1', type: 'success' as const, content: 'Message 1' },
      { id: '2', type: 'error' as const, content: 'Message 2' },
    ]
    render(<LMMessageContainer messages={messages} onClose={vi.fn()} />)

    expect(screen.getByText('Message 1')).toBeInTheDocument()
    expect(screen.getByText('Message 2')).toBeInTheDocument()
  })

  it('applies correct position classes', () => {
    const messages = [{ id: '1', type: 'info' as const, content: 'Test' }]
    const { container } = render(
      <LMMessageContainer messages={messages} onClose={vi.fn()} position="bottom-center" />
    )

    expect(container.firstChild).toHaveClass('bottom-6')
  })
})

describe('useMessage hook', () => {
  const TestComponent = () => {
    const { messages, success, error, warning, info, removeMessage, clearAll } = useMessage()

    return (
      <div>
        <button onClick={() => success('Success!')}>Add Success</button>
        <button onClick={() => error('Error!')}>Add Error</button>
        <button onClick={() => warning('Warning!')}>Add Warning</button>
        <button onClick={() => info('Info!')}>Add Info</button>
        <button onClick={() => clearAll()}>Clear All</button>
        <div data-testid="message-count">{messages.length}</div>
        <LMMessageContainer messages={messages} onClose={removeMessage} />
      </div>
    )
  }

  it('adds success message', () => {
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Add Success'))
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  it('adds error message', () => {
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Add Error'))
    expect(screen.getByText('Error!')).toBeInTheDocument()
  })

  it('adds warning message', () => {
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Add Warning'))
    expect(screen.getByText('Warning!')).toBeInTheDocument()
  })

  it('adds info message', () => {
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Add Info'))
    expect(screen.getByText('Info!')).toBeInTheDocument()
  })

  it('clears all messages', () => {
    render(<TestComponent />)

    fireEvent.click(screen.getByText('Add Success'))
    fireEvent.click(screen.getByText('Add Error'))
    expect(screen.getByTestId('message-count')).toHaveTextContent('2')

    fireEvent.click(screen.getByText('Clear All'))
    expect(screen.getByTestId('message-count')).toHaveTextContent('0')
  })
})
