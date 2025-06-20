"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import "./FileUpload.css"

const FileUpload = ({
  onFileChange,
  accept = "*/*",
  placeholder = "Documents",
  error = false,
  className = "",
  ...props
}) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      if (onFileChange) {
        onFileChange(file)
      }
    }
  }

  const handleRemoveFile = (e) => {
    e.stopPropagation()
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onFileChange) {
      onFileChange(null)
    }
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={`file-upload-wrapper ${error ? "error" : ""} ${className}`} onClick={handleClick} {...props}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="file-upload-input"
        hidden
      />

      <div className="file-upload-field">
        {uploadedFile ? (
          <>
            <span className="file-upload-label">Document</span>
            <div className="file-upload-content">
              <span className="file-upload-filename">{uploadedFile.name}</span>
              <button className="file-remove-button" onClick={handleRemoveFile} type="button">
                <X size={16} />
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="file-upload-label">{placeholder}</span>
            <div className="file-upload-content">
              <Upload className="file-upload-icon" size={16} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default FileUpload
