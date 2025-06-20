"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import "./EmployeeTable.css";

const EmployeesTable = ({ data = [], onActionClick, className = "" }) => {
  const [openActionDropdown, setOpenActionDropdown] = useState(null);
  const dropdownRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openActionDropdown !== null) {
        const dropdownRef = dropdownRefs.current[openActionDropdown];
        if (dropdownRef && !dropdownRef.contains(event.target)) {
          setOpenActionDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionDropdown]);

  const handleActionClick = (action, rowData, rowIndex) => {
    setOpenActionDropdown(null);
    if (onActionClick) {
      onActionClick(action, rowData, rowIndex);
    }
  };

  const toggleActionDropdown = (rowIndex, event) => {
    if (openActionDropdown === rowIndex) {
      setOpenActionDropdown(null);
    } else {
      setOpenActionDropdown(rowIndex);
      // Calculate position for fixed dropdown
      const rect = event.currentTarget.getBoundingClientRect();
      const dropdown =
        dropdownRefs.current[rowIndex]?.querySelector(".action-dropdown");
      if (dropdown) {
        dropdown.style.top = `${rect.bottom + window.scrollY + 4}px`;
        dropdown.style.left = `${rect.right + window.scrollX - 160}px`; // 160px is dropdown width
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClass = status.toLowerCase().replace(/\s+/g, "-");
    return `status-badge status-${statusClass}`;
  };

  const actions = [
    {
      label: "Edit Employee",
      icon: Edit,
      action: "edit",
    },
    {
      label: "Delete Employee",
      icon: Trash2,
      action: "delete",
    },
  ];

  return (
    <div className={`employees-table-container ${className}`}>
      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th className="table-header center">Profile</th>
              <th className="table-header left">Employee Name</th>
              <th className="table-header left">Email Address</th>
              <th className="table-header left">Position</th>
              <th className="table-header left">Department</th>
              {/* <th className="table-header center">Status</th> */}
              <th className="table-header center">Date of Joining</th>
              <th className="table-header center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, rowIndex) => (
              <tr key={rowIndex} className="table-row">
                <td className="table-cell center">
                  <div className="user-avatar-placeholder">
                    {employee.name?.charAt(0).toUpperCase()}
                  </div>
                </td>
                <td className="table-cell left">{employee?.name}</td>
                <td className="table-cell left">{employee?.email}</td>
                <td className="table-cell left">{employee?.position}</td>
                <td className="table-cell left">{employee?.department}</td>

                <td className="table-cell center">
                  {employee?.joiningDate?.split("T")[0]}
                </td>
                <td className="table-cell center">
                  <div
                    className="action-dropdown-container"
                    ref={(el) => (dropdownRefs.current[rowIndex] = el)}
                  >
                    <button
                      className="action-button"
                      onClick={() => toggleActionDropdown(rowIndex)}
                      aria-expanded={openActionDropdown === rowIndex}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openActionDropdown === rowIndex && (
                      <div className="action-dropdown">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className="action-dropdown-item"
                            onClick={() =>
                              handleActionClick(action, employee, rowIndex)
                            }
                          >
                            <action.icon size={16} className="action-icon" />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="empty-state">
            <p>No employees found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesTable;
