import React from 'react'

export interface LMFieldProps {
  /** Field label */
  label: string
  /** Required indicator */
  required?: boolean
  /** Error message */
  errorMessage?: string
  /** Help text */
  help?: string
  /** Children */
  children: React.ReactNode
  /** Class name */
  className?: string
}

const LMField: React.FC<LMFieldProps> = ({
  label,
  required = false,
  errorMessage,
  help,
  children,
  className = '',
}) => {
  let controlId: string | undefined
  const firstChild = Array.isArray(children)
    ? children.find(Boolean)
    : (children as React.ReactNode)

  if (
    React.isValidElement<{ id?: string }>(firstChild) &&
    typeof firstChild.props.id === 'string'
  ) {
    controlId = firstChild.props.id
  }

  const containerClass = `space-y-2 ${className}`.trim().replace(/\s+/g, ' ')

  return (
    <div className={containerClass}>
      <label
        htmlFor={controlId}
        className="block text-xs font-semibold tracking-wide"
        style={{ color: 'var(--lm-text-primary)' }}
        aria-required={required || undefined}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: 'var(--lm-error-500)' }}>
            *
          </span>
        )}
      </label>

      {help && (
        <p className="text-xs" style={{ color: 'var(--lm-text-secondary)' }}>
          {help}
        </p>
      )}

      {children}

      {errorMessage && (
        <p
          className="text-xs flex items-center gap-1"
          style={{ color: 'var(--lm-error-500)' }}
          role="alert"
          aria-live="polite"
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default LMField
