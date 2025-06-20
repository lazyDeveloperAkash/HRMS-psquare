import { FileText } from "lucide-react";
import StatusDropdown from "../../Tags/dropdown/StatusDropdown";
import "./LeaveTable.css";
import { useDispatch } from "react-redux";
import { updateLeaveStatus } from "../../../redux/slices/leaveSlice";

const leaveStatusOptions = [
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

const AppliedLeaves = ({ data = [], onStatusChange, className = "" }) => {
  const dispatch = useDispatch();

  const handleStatusChange = (option, leave) => {
    dispatch(updateLeaveStatus({ id: leave._id, status: option.value }));
  };

  const documentHandler = (rowData) => {
    const document = rowData.document;
    const cleanPath = document.path.replace(/\\/g, "/");
    const fileUrl = `${
      import.meta.env.VITE_BASE_URL || "http://localhost:5000"
    }/${cleanPath}`;

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`applied-leaves-container ${className}`}>
      <div className="applied-leaves-header">
        <h2>Applied Leaves</h2>
      </div>

      <div className="applied-leaves-content">
        <div className="leaves-table-header">
          <div className="header-cell profile-header">Profile</div>
          <div className="header-cell name-header">Name</div>
          <div className="header-cell date-header">Date</div>
          <div className="header-cell reason-header">Reason</div>
          <div className="header-cell status-header">Status</div>
          <div className="header-cell docs-header">Docs</div>
        </div>

        <div className="leaves-table-body">
          {data.length > 0 ? (
            data.map((leave, idx) => (
              <div key={idx} className="leave-row">
                <div className="row-cell profile-cell">
                  <div className="profile-info">
                    <div className="user-avatar-placeholder">
                      {leave.employee.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="row-cell name-cell">
                  <div className="name-info">
                    <div className="employee-name">{leave?.employee?.name}</div>
                  </div>
                </div>
                <div className="row-cell date-cell">
                  {leave?.appliedDate?.split("T")[0]}
                </div>
                <div className="row-cell reason-cell">{leave?.reason}</div>
                <div className="row-cell status-cell">
                  <StatusDropdown
                    options={leaveStatusOptions}
                    value={leave.status || "Pending"}
                    onChange={(option) => handleStatusChange(option, leave)}
                  />
                </div>
                <div className="row-cell docs-cell">
                  {leave.document ? (
                    <button
                      onClick={() => documentHandler(leave)}
                      className="docs-button"
                      title="View Documents"
                    >
                      <FileText size={16} />
                    </button>
                  ) : (
                    <FileText
                      size={16}
                      style={{
                        color: "gray",
                        filter: "blur(1px)",
                      }}
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No Leaves found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedLeaves;
