import { Users, Building2, Calendar, FileText, LogOut } from "lucide-react"
import "./SideNavbar.css"
import Logo from "../Logo"
import SearchBar from "../search-bar/SearchBar"

const SideNavbar = ({ currentRoute, onRouteChange }) => {
  const menuItems = [
    {
      section: "recruitment",
      title: "Recruitment",
      items: [
        {
          id: "candidates",
          label: "Candidates",
          icon: Users,
          route: "/dashboard/candidates",
        },
      ],
    },
    {
      section: "organization",
      title: "Organization",
      items: [
        {
          id: "employees",
          label: "Employees",
          icon: Building2,
          route: "/dashboard/employees",
        },
        {
          id: "attendance",
          label: "Attendance",
          icon: Calendar,
          route: "/dashboard/attendance",
        },
        {
          id: "leaves",
          label: "Leaves",
          icon: FileText,
          route: "/dashboard/leaves",
        },
      ],
    },
  ]

  const handleRouteClick = (route, id) => {
    if (onRouteChange) {
      onRouteChange(route, id)
    }
  }

  return (
    <div className="side-navbar">
      <div className="navbar-header">
        <Logo />
        <SearchBar />
      </div>

      <nav className="navbar-menu">
        {menuItems.map((section) => (
          <div key={section.section} className="menu-section">
            <div className="section-header">
              <span className="section-title">{section.title}</span>
            </div>

            <div className="section-items expanded">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive =
                  currentRoute === item.route ||
                  currentRoute.includes(item.id)

                return (
                  <div
                    key={item.id}
                    className={`menu-item ${isActive ? "active" : ""}`}
                    onClick={() => handleRouteClick(item.route, item.id)}
                  >
                    <Icon size={18} className="menu-icon" />
                    <span className="menu-label">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div className="menu-section others">
          <div className="section-header">
            <span className="section-title">Others</span>
          </div>
          <div className="section-items expanded">
            <button
              className="menu-item logout"
              onClick={() => handleRouteClick("/logout", "logout")}
            >
              <LogOut size={18} className="menu-icon" />
              <span className="menu-label">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default SideNavbar
