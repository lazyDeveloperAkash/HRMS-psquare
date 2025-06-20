import { useState, forwardRef } from "react"
import "./Input.css"

const Input = forwardRef(
  (
    {
      placeholder,
      disabled = false,
      error = false,
      type = "text",
      value,
      onChange,
      onFocus,
      onBlur,
      className = "",
      required = false,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const handleFocus = (e) => {
      setIsFocused(true)
      if (onFocus) onFocus(e)
    }

    const handleBlur = (e) => {
      setIsFocused(false)
      setHasValue(e.target.value !== "")
      if (onBlur) onBlur(e)
    }

    const handleChange = (e) => {
      setHasValue(e.target.value !== "")
      if (onChange) onChange(e)
    }

    const isLabelFloating = isFocused || hasValue || value

    return (
      <div className={`floating-input-container ${error ? "error" : ""} ${disabled ? "disabled" : ""} ${className}`}>
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`floating-input ${isLabelFloating ? "has-content" : ""}`}
          {...props}
        />
        <label className={`floating-label ${isLabelFloating ? "floating" : ""}`}>
          {placeholder}
          {required && <span className="required-asterisk">*</span>}
        </label>
      </div>
    )
  },
)

Input.displayName = "Input"

export default Input;
