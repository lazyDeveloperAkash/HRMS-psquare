"use client"

import { useState, forwardRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import Input from "./Input"
import "./Input.css"

const PasswordInput = forwardRef(({ placeholder = "Password", showToggle = true, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="password-input-container">
      <Input ref={ref} type={showPassword ? "text" : "password"} placeholder={placeholder} {...props} />
      {showToggle && (
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
          disabled={props.disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  )
})

PasswordInput.displayName = "PasswordInput"

export default PasswordInput
