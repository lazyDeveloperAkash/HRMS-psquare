"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { createPortal } from "react-dom"
import "./DatePicker.css"

const DatePicker = ({ value, onChange, placeholder = "Select date", error = false, className = "", ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const calculateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      let top = rect.bottom + scrollTop + 4
      let left = rect.left + scrollLeft

      const dropdownWidth = 280
      const dropdownHeight = 320
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left + dropdownWidth > viewportWidth) {
        left = viewportWidth - dropdownWidth - 10
      }

      if (top + dropdownHeight > viewportHeight + scrollTop) {
        top = rect.top + scrollTop - dropdownHeight - 4
      }

      setDropdownPosition({ top, left })
    }
  }

  const handleInputClick = () => {
    if (!isOpen) {
      calculateDropdownPosition()
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isOpen])

  const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setIsOpen(false)
    if (onChange) {
      onChange(date.toISOString().split("T")[0])
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }
    <br></br>

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? "selected" : ""}`}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </div>,
      )
    }

    return days
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const renderDropdown = () => {
    if (!isOpen) return null

    return (
      <div
        ref={containerRef}
        className="date-picker-dropdown"
        style={{
          position: "fixed",
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          zIndex: 10000,
        }}
      >
        <div className="calendar-header">
          <button type="button" onClick={handlePrevMonth} className="calendar-nav-button">
            <ChevronLeft size={16} />
          </button>
          <span className="calendar-month-year">
            {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
          </span>
          <button type="button" onClick={handleNextMonth} className="calendar-nav-button">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {dayNames.map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar-days">
            {renderCalendar()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`date-picker-container ${className}`} {...props}>
        <div ref={inputRef} className={`date-picker-input ${error ? "error" : ""}`} onClick={handleInputClick}>
          <span className="date-picker-text">{selectedDate ? formatDate(selectedDate) : placeholder}</span>
          <Calendar className="date-picker-icon" size={16} />
        </div>
      </div>
      {typeof window !== "undefined" && createPortal(renderDropdown(), document.body)}
    </>
  )
}

export default DatePicker
