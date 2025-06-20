"use client"

import Modal from "../Modal"
import Button from "../../Tags/button/Button"
import "./LogoutModal.css"

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const handleLogout = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Out" className="logout-modal" showCloseButton={false}>
      <div className="logout-modal-content">
        <p className="logout-message">Are you sure you want to log out?</p>
        <div className="logout-actions">
          <Button variant="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleLogout} className="logout-button">
            Logout
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default LogoutModal
