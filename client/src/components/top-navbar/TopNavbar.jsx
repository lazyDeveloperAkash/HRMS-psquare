import { useState, useRef, useEffect } from "react";
import { Bell, Mail, ChevronDown, Menu } from "lucide-react";
import "./TopNavbar.css";

const TopNavbar = ({ currentRouteName = "Dashboard", userInfo }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
    // toggle function:
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notifications = [
    {
      id: 1,
      message: "New candidate application received",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      message: "Interview scheduled for tomorrow",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      message: "Employee leave request approved",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="top-navbar">
      <div className="navbar-left">
        <button className="hamburger-button" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="route-title">{currentRouteName}</h1>
      </div>

      <div className="navbar-right">
        {/* Email Icon */}
        <Mail style={{ cursor: "pointer" }} color="black" size={20} />

        {/* Notification Icon */}
        <div className="notification-container">
          <div className="nav-icon-button notification-button">
            <Bell color="black" style={{ cursor: "pointer" }} size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="profile-container" ref={profileRef}>
          <div
            className="profile-button"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            aria-expanded={showProfileDropdown}
          >
            <div className="profile-avatar">
              <img
                src={userInfo?.avatar || "./profile.webp?height=32&width=32"}
                alt={userInfo?.name || "User"}
                className="avatar-image"
              />
            </div>
            <ChevronDown
              size={16}
              className={`profile-arrow ${
                showProfileDropdown ? "rotated" : ""
              }`}
            />
          </div>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                <button>Edit Profile</button>
              </div>
              <div className="dropdown-item">
                <button>Change Password</button>
              </div>
              <div className="dropdown-item">
                <button>Manage Notification</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
