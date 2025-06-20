import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import "./LeaveCalendar.css";

const LeaveCalendar = ({ approvedLeaves = [] }) => {
  // Sample data based on your object structure
  const leaveData = [
    {
      appliedDate: "2024-09-09T00:00:00.000Z",
      approvedBy: "68537dbd5bf1374e809593c3",
      approvedDate: "2024-09-08T14:33:44.888Z",
      createdAt: "2024-09-08T14:08:34.054Z",
      designation: "Backend Developer",
      document: {
        filename: "1750342114021-4028d2d2-ae77-4401-a0d8-1ec1fd2c05fd.png",
        path: "uploads/general/1750342114021-4028d2d2-ae77-4401-a0d8-1ec1fd2c05fd.png",
        mimetype: "image/png",
        size: 135186,
      },
      employee: {
        email: "cody@gmail.com",
        name: "Cody Fisher",
        phone: "9920583360",
        _id: "6852cbc597082b7576ecb414",
      },
      reason: "Personal work",
      status: "Approved",
      updatedAt: "2024-09-08T14:33:44.894Z",
    },
    {
      appliedDate: "2024-09-09T00:00:00.000Z",
      approvedBy: "68537dbd5bf1374e809593c3",
      approvedDate: "2024-09-08T14:33:44.888Z",
      createdAt: "2024-09-08T14:08:34.054Z",
      designation: "Frontend Developer",
      document: null,
      employee: {
        email: "john@gmail.com",
        name: "John Doe",
        phone: "9920583361",
        _id: "6852cbc597082b7576ecb415",
      },
      reason: "Medical appointment",
      status: "Approved",
      updatedAt: "2024-09-08T14:33:44.894Z",
    },
    {
      appliedDate: "2024-09-15T00:00:00.000Z",
      approvedBy: "68537dbd5bf1374e809593c3",
      approvedDate: "2024-09-14T14:33:44.888Z",
      createdAt: "2024-09-14T14:08:34.054Z",
      designation: "UI/UX Designer",
      document: null,
      employee: {
        email: "sarah@gmail.com",
        name: "Sarah Wilson",
        phone: "9920583362",
        _id: "6852cbc597082b7576ecb416",
      },
      reason: "Family function",
      status: "Approved",
      updatedAt: "2024-09-14T14:33:44.894Z",
    },
  ];

  const [currentDate, setCurrentDate] = useState(new Date(2024, 8)); // September 2024
  const [selectedDate, setSelectedDate] = useState(9);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Get approved leaves grouped by date
  const approvedLeavesByDate = useMemo(() => {
    const grouped = {};
    approvedLeaves
      .filter((leave) => leave.status === "Approved")
      .forEach((leave) => {
        const date = new Date(leave.appliedDate);
        const dateKey = date.getDate();
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(leave);
      });
    return grouped;
  }, []);

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    if (day.getMonth() === currentDate.getMonth()) {
      setSelectedDate(day.getDate());
    }
  };

  const getSelectedDateLeaves = () => {
    return approvedLeavesByDate[selectedDate] || [];
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="leave-calendar">
      {/* Header */}
      <div className="calendar-header">
        <h2 className="calendar-title">Leave Calendar</h2>
      </div>

      {/* Calendar Navigation */}
      <div className="calendar-content">
        <div className="calendar-navigation">
          <button onClick={() => navigateMonth(-1)} className="nav-button">
            <ChevronLeft className="nav-icon" />
          </button>
          <h3 className="month-title">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={() => navigateMonth(1)} className="nav-button">
            <ChevronRight className="nav-icon" />
          </button>
        </div>

        {/* Week Headers */}
        <div className="week-headers">
          {weekDays.map((day) => (
            <div key={day} className="week-day">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const dayNumber = day.getDate();
            const isSelected = isCurrentMonth && dayNumber === selectedDate;
            const hasLeaves = isCurrentMonth && approvedLeavesByDate[dayNumber];
            const leaveCount = hasLeaves
              ? approvedLeavesByDate[dayNumber].length
              : 0;

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={`calendar-day ${!isCurrentMonth ? "inactive" : ""} ${
                  isSelected ? "selected" : ""
                }`}
              >
                {dayNumber}
                {hasLeaves && <div className="leave-badge">{leaveCount}</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Approved Leaves Section */}
      <div className="approved-leaves-section">
        <h3 className="section-title">Approved Leaves</h3>
        <div className="leaves-list">
          {getSelectedDateLeaves().length > 0 ? (
            getSelectedDateLeaves().map((leave, index) => (
              <div key={index} className="leave-item">
                <div className="employee-avatar">
                  <div className="user-avatar-placeholder">
                    {leave.employee.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="employee-info">
                  <div className="employee-name">{leave.employee.name}</div>
                  <div className="employee-designation">
                    {leave.designation}
                  </div>
                </div>
                <div className="leave-date">
                  {new Date(leave.appliedDate).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="no-leaves">
              No approved leaves for {monthNames[currentDate.getMonth()]}{" "}
              {selectedDate}, {currentDate.getFullYear()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
