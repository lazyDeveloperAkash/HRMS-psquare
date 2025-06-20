import { useEffect, useState } from "react";
import SideNavbar from "../side-navbar/SideNavbar";
import TopNavbar from "../top-navbar/TopNavbar";
import SearchBar from "../search-bar/SearchBar";
import Button from "../Tags/button/Button";
import "./Dashboard.css";
import StatusDropdown from "../Tags/dropdown/StatusDropdown";
import Dropdown from "../Tags/dropdown/DropDown";
import AttendanceTable from "../table/attendance-table/AttendanceTable";
import LeaveTable from "../table/leave-table/LeaveTable";
import EmployeeTable from "../table/employee-table/EmployeeTable";
import AddLeaveModal from "../modals/add-leave/AddLeaveModal";
import EditEmployeeModal from "../modals/edit-employee/EditEmployeeModal";
import AddCandidateModal from "../modals/add-candidate/AddCandidateModal";
import LogoutModal from "../modals/log-out/LogoutModal";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import CandidatesTable from "../table/candidate-table/CandidateTable";
import {
  createCandidate,
  deleteCandidate,
  fetchCandidates,
  updateCandidate,
} from "../../redux/slices/candidateSlice";
import LeaveCalendar from "../leave-calender/LeaveCalendar";
import { createLeave, fetchLeaves } from "../../redux/slices/leaveSlice";

const Dashboard = () => {
  const [currentRoute, setCurrentRoute] = useState("/dashboard/candidates");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const dispatch = useDispatch();
  const { candidates, isLoading } = useSelector((state) => state.candidate);
  const { leaves } = useSelector((state) => state.leave);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (candidates.length === 0) dispatch(fetchCandidates());
    if(leaves.length === 0) dispatch(fetchLeaves());
  }, []);


  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "new", label: "New" },
    { value: "selected", label: "Selected" },
    { value: "rejected", label: "Rejected" },
    { value: "ongoing", label: "Ongoing" },
    { value: "scheduled", label: "Scheduled" },
  ];

  const positionOptions = [
    { value: "all", label: "All Positions" },
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "manager", label: "Manager" },
    { value: "hr", label: "Human Resource" },
  ];

  const handleRouteChange = (route, routeId) => {
    if (routeId === "logout") {
      setShowLogoutModal(true);
      return;
    }
    setCurrentRoute(route);
    setSelectedStatus("all");
    setSearchQuery("")
  };

  const handleStatusChange = (option) => {
    setSelectedStatus(option.value);
    console.log("Status filter:", option.value);
  };

  const handlePositionChange = (option) => {
    setSelectedPosition(option.value);
    console.log("Position filter:", option.value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddCandidate = () => {
    if (currentRoute.includes("candidates")) {
      setShowAddCandidateModal(true);
    } else if (currentRoute.includes("leaves")) {
      setShowAddLeaveModal(true);
    }
    // Add other modal triggers as needed
  };

  const handleTableAction = (action, rowData, rowIndex) => {
    console.log(
      "Table action:",
      action.action,
      "Row:",
      rowData,
      "Index:",
      rowIndex
    );

    if (action.action === "download") {
      const resume = rowData.resume;
      const cleanPath = resume.path.replace(/\\/g, "/");
      const fileUrl = `${
        import.meta.env.VITE_BASE_URL || "http://localhost:5000"
      }/${cleanPath}`;

      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else if (action.action === "delete") {
      if (confirm(`Are you sure you want to delete ${rowData?.name}?`)) {
        dispatch(deleteCandidate(rowData._id));
      }
    } else if (action.action === "edit") {
      setSelectedEmployee(rowData);
      setShowEditEmployeeModal(true);
    }
  };

  const handleCandidateStatusChange = (option, rowData, rowIndex) => {
    console.log("Candidate status changed:", option, rowData, rowIndex);
    // Update the status in your data
  };

  const handleAttendanceStatusChange = (option, rowData, rowIndex) => {
    console.log("Attendance status changed:", option, rowData, rowIndex);
    // Update the status in your data
  };

  const getRouteTitle = () => {
    if (currentRoute.includes("candidates")) return "Candidates";
    if (currentRoute.includes("employees")) return "Employees";
    if (currentRoute.includes("attendance")) return "Attendance";
    if (currentRoute.includes("leaves")) return "Leaves";
    return "Dashboard";
  };

  // Filter data based on search and filters
  const filteredCandidatesData = candidates.filter((candidate) => {
    const matchesSearch =
      candidate?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      candidate?.email?.toLowerCase()?.includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || candidate.status === selectedStatus || candidate.attendance === selectedStatus;
    const matchesPosition =
      selectedPosition === "all" ||
      candidate?.position
        ?.toLowerCase()
        ?.includes(selectedPosition?.toLowerCase());

    return matchesSearch && matchesStatus && matchesPosition;
  });

  const filteredleavesData = leaves.filter((leave) => {
    const matchesSearch =
      leave?.employee?.name?.toLowerCase()?.includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || leave.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });


  const handleLeaveFilter = (status)=>{
    if(status === "All") return leaves
    return leaves.filter((leave)=> leave.status === status);
  }

  const renderCurrentTable = () => {
    if (currentRoute.includes("employees")) {
      return (
        <EmployeeTable
          data={filteredCandidatesData.filter(
            (candidate) => candidate.status === "Selected"
          )}
          onActionClick={handleTableAction}
        />
      );
    } else if (currentRoute.includes("attendance")) {
      return (
        <AttendanceTable
          data={filteredCandidatesData.filter(
            (candidate) => candidate.status === "Selected"
          )}
          onActionClick={handleTableAction}
          onStatusChange={handleAttendanceStatusChange}
        />
      );
    } else if (currentRoute.includes("leaves")) {
      return (
        <div className="leave-management-container">
          <LeaveTable
            data={filteredleavesData}
            onStatusChange={handleStatusChange}
          />
          <LeaveCalendar approvedLeaves={leaves.filter((leave)=> leave.status === "Approved")} />
        </div>
      );
    } 
    else {
      // Candidates table
      return (
        <CandidatesTable
          data={filteredCandidatesData}
          onActionClick={handleTableAction}
        />
      );
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleAddCandidateSubmit = (data) => {
    dispatch(createCandidate(data));
  };

  const handleEditEmployeeSubmit = (data) => {
    dispatch(updateCandidate({id: selectedEmployee._id, updateData: {...data}}))
  };

  const handleAddLeaveSubmit = (data) => {
    dispatch(createLeave(data));
  };

  return (
    <div className="dashboard-layout">
      <SideNavbar
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
      />

      <div className="dashboard-main">
        <TopNavbar currentRouteName={getRouteTitle()} userInfo={user} />

        <div className="dashboard-content">
          <div className="content-header">
            <div className="filters-section">
              {currentRoute.includes("candidates") && (
                <>
                  <Dropdown
                    options={statusOptions}
                    defaultValue="all"
                    placeholder="Status"
                    onChange={handleStatusChange}
                    className="filter-dropdown"
                  />
                  <Dropdown
                    options={positionOptions}
                    defaultValue="all"
                    placeholder="Position"
                    onChange={handlePositionChange}
                    className="filter-dropdown"
                  />
                </>
              )}
              {currentRoute.includes("employees") && (
                <Dropdown
                  options={positionOptions}
                  defaultValue="all"
                  placeholder="Position"
                  onChange={handlePositionChange}
                  className="filter-dropdown"
                />
              )}
              {currentRoute.includes("attendance") && (
                <Dropdown
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "Present", label: "Present" },
                    { value: "Absent", label: "Absent" },
                  ]}
                  defaultValue="all"
                  placeholder="Status"
                  onChange={handleStatusChange}
                  className="filter-dropdown"
                />
              )}

              {currentRoute.includes("leaves") && (
                <Dropdown
                  options={[
                    { value: "all", label: "All Status" },
                    { value: "Approved", label: "Approved" },
                    { value: "Rejected", label: "Rejected" },
                  ]}
                  defaultValue="all"
                  placeholder="Status"
                  onChange={handleStatusChange}
                  className="filter-dropdown"
                />
              )}
            </div>

            <div className="search-section">
              <SearchBar
                placeholder="Search"
                onSearch={handleSearch}
                className="dashboard-search"
              />
              {(currentRoute.includes("leaves") ||
                currentRoute.includes("candidates")) && (
                <Button
                  variant="primary"
                  onClick={handleAddCandidate}
                  className="add-button"
                >
                  {currentRoute.includes("candidates") && "Add Candidate"}
                  {currentRoute.includes("leaves") && "Add Leave"}
                </Button>
              )}
            </div>
          </div>

          <div className="table-section">{renderCurrentTable()}</div>
        </div>
      </div>

      {/* Modals */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <AddCandidateModal
        isOpen={showAddCandidateModal}
        onClose={() => setShowAddCandidateModal(false)}
        onSubmit={handleAddCandidateSubmit}
      />

      <EditEmployeeModal
        isOpen={showEditEmployeeModal}
        onClose={() => {
          setShowEditEmployeeModal(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleEditEmployeeSubmit}
        employeeData={selectedEmployee}
      />

      <AddLeaveModal
        isOpen={showAddLeaveModal}
        onClose={() => setShowAddLeaveModal(false)}
        onSubmit={handleAddLeaveSubmit}
      />
    </div>
  );
};

export default Dashboard;
