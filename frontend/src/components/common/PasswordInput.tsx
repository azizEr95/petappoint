import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { Eye, EyeSlash } from 'react-bootstrap-icons'
import type { ChangeEvent, FocusEvent } from 'react'
import '../../styles/components/_password-input.scss'

type PasswordInputProps = {
  id: string
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  isInvalid?: boolean
  error?: string
  className?: string
  required?: boolean
  disabled?: boolean
  label?: string
}

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = '••••••••',
  isInvalid = false,
  error,
  className = '',
  required = false,
  disabled = false,
  label,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Form.Group className={className}>
      {label && (
        <Form.Label htmlFor={id} className="form-label">
          {label}
          {required && ' *'}
        </Form.Label>
      )}
      <div className="password-input-wrapper">
        <Form.Control
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          isInvalid={isInvalid}
          disabled={disabled}
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeSlash size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
      {error && (
        <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  )
}
