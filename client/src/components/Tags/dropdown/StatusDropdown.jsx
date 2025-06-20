import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import "./StatusDropdown.css"

const StatusDropdown = ({
  options = [],
  value,
  onChange,
  disabled = false,
  className = "",
  placeholder = "Select status",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 })
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)

   const calculateMenuPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      // CHANGE: Check if we're inside a modal
      const isInModal = triggerRef.current.closest(".modal-container")

      setMenuPosition({
        top: rect.bottom + scrollTop + 4,
        left: rect.left + scrollLeft,
        width: Math.max(rect.width, 120),
        zIndex: isInModal ? 1001 : 1000, // CHANGE: Higher z-index for modals
      })
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
      return () => {
        document.removeEventListener("keydown", handleEscapeKey)
      }
    }
  }, [isOpen])

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        calculateMenuPosition()
      }
      setIsOpen(!isOpen)
    }
  }

  const handleSelect = (option) => {
    setIsOpen(false)
    if (onChange) {
      onChange(option)
    }
  }

  const selectedOption = options.find((option) => option.value === value)
  const displayText = selectedOption ? selectedOption.label : placeholder

  return (
    <div
      ref={dropdownRef}
      className={`status-dropdown-container ${disabled ? "disabled" : ""} ${className}`}
      {...props}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`status-dropdown-trigger ${isOpen ? "open" : ""} ${
          selectedOption ? `status-${selectedOption.value.toLowerCase().replace(/\s+/g, "-")}` : ""
        }`}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="status-dropdown-text">{displayText}</span>
        <ChevronDown className={`status-dropdown-icon ${isOpen ? "rotated" : ""}`} size={14} />
      </button>

      {isOpen && (
        <div
          className="status-dropdown-menu"
          role="listbox"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            width: `${menuPosition.width}px`,
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`status-dropdown-option status-${option.value.toLowerCase().replace(/\s+/g, "-")} ${
                value === option.value ? "selected" : ""
              }`}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={value === option.value}
            >
              <span className="status-option-text">{option.label}</span>
            </div>
          ))}
          {options.length === 0 && <div className="status-dropdown-empty">No options available</div>}
        </div>
      )}
    </div>
  )
}

export default StatusDropdown
