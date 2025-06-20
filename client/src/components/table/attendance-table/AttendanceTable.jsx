"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit, Eye, Clock } from "lucide-react";
import "./AttendanceTable.css";
import StatusDropdown from "../../Tags/dropdown/StatusDropdown";
import { updateCandidate } from "../../../redux/slices/candidateSlice";
import { useDispatch } from "react-redux";

const attendanceStatusOptions = [
  { value: "Absent", label: "Absent" },
  { value: "Present", label: "Present" },
];

const AttendanceTable = ({ data = [], className = "" }) => {
  const [openActionDropdown, setOpenActionDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const dispatch = useDispatch();

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

  const handleStatusChange = async (rowIndex, option) => {
    const candidate = data[rowIndex];
    dispatch(
      updateCandidate({
        id: candidate._id,
        updateData: { attendance: option.value },
      })
    );
  };

  return (
    <div className={`attendance-table-container ${className}`}>
      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="table-header left">Profile</th>
              <th className="table-header left">Employee Name</th>
              <th className="table-header center">Position</th>
              <th className="table-header center">Department</th>
              <th className="table-header center">Status</th>
              <th className="table-header center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((attendance, rowIndex) => (
              <tr key={rowIndex} className="table-row">
                <td className="table-cell left">
                  <div className="user-avatar-placeholder">
                    {attendance.name?.charAt(0).toUpperCase()}
                  </div>
                </td>
                <td className="table-cell left">{attendance.name}</td>
                <td className="table-cell left">{attendance.position}</td>
                <td className="table-cell center">{attendance.department}</td>
                <td className="table-cell center">
                  <StatusDropdown
                    options={attendanceStatusOptions}
                    value={attendance.attendance}
                    onChange={(option) => handleStatusChange(rowIndex, option)}
                  />
                </td>
                <td className="table-cell center">
                  <MoreVertical size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="empty-state">
            <p>No attendance records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTable;
