"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import "./Modal.css"

const Modal = ({ isOpen, onClose, title, children, className = "", showCloseButton = true, ...props }) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
      document.body.style.overflow = "hidden" // Prevent background scroll
      return () => {
        document.removeEventListener("keydown", handleEscapeKey)
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} {...props}>
      <div className={`modal-container ${className}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          {showCloseButton && (
            <button className="modal-close-button" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          )}
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}

export default Modal
