// DropdownMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './Dropdown.css'; // Import the CSS file

const Dropdown = ({
  options = [],
  defaultValue = null,
  placeholder = "Select an option",
  disabled = false,
  error = false,
  onChange,
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    setSelectedValue(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  const getDisplayText = () => {
    if (selectedValue) {
      return typeof selectedValue === 'string' ? selectedValue : selectedValue.label || selectedValue.value;
    }
    return placeholder;
  };

  return (
    <div className={`dropdown-container ${className}`} ref={dropdownRef} {...props}>
      <button
        type="button"
        className={`dropdown-trigger ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className={`dropdown-text ${!selectedValue ? 'placeholder' : ''}`}>
          {getDisplayText()}
        </span>
        <ChevronDown 
          className={`dropdown-icon ${isOpen ? 'rotated' : ''}`} 
          size={20}
        />
      </button>
      
      {isOpen && (
        <div className="dropdown-menu" style={{maxHeight: "100px"}}>
          {options.map((option, index) => {
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label || option.value;
            const isSelected = selectedValue === option || 
              (selectedValue && typeof selectedValue === 'object' && selectedValue.value === optionValue);
            
            return (
              <div
                key={index}
                className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {optionLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;