"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import "./UserSearchInput.css";

const UserSearchInput = ({
  users = [],
  onUserSelect,
  placeholder = "Search Employee Name",
  className = "",
  disabled = false,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  //   console.log(users);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers([]);
      setIsDropdownOpen(false);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
      setIsDropdownOpen(filtered.length > 0);
    }
  }, [searchQuery, users]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedUser(null); // Clear selection when typing
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.name);
    setIsDropdownOpen(false);

    // Call the callback function with the selected user
    if (onUserSelect) {
      onUserSelect(user);
    }
  };

  const handleClear = () => {
    setSelectedUser(null);
    setSearchQuery("");
    setIsDropdownOpen(false);
    inputRef.current?.focus();

    // Call the callback function with null to indicate clearing
    if (onUserSelect) {
      onUserSelect(null);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery && filteredUsers.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`user-search-container ${className}`} {...props}>
      <div className="search-input-wrapper">
        {!selectedUser && <Search className="search-icon" size={18} />}

        <input
          style={{ borderRadius: "8px" }}
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`search-input ${selectedUser ? "has-selection" : ""}`}
        />

        {(selectedUser || searchQuery) && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-button"
            aria-label="Clear selection"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isDropdownOpen && filteredUsers.length > 0 && (
        <div ref={dropdownRef} className="search-dropdown">
          {filteredUsers.map((user, idx) => (
            <div
              key={idx}
              className="user-option"
              onClick={() => handleUserSelect(user)}
            >
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-position">{user.position}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchInput;
