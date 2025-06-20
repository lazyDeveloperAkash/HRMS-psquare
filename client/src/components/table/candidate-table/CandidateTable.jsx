import { useState, useRef, useEffect } from "react";
import { MoreVertical, Download, Trash2 } from "lucide-react";
import "./CandidateTable.css";
import StatusDropdown from "../../Tags/dropdown/StatusDropdown";
import { useDispatch } from "react-redux";
import { updateCandidate } from "../../../redux/slices/candidateSlice";
const candidateStatusOptions = [
  { value: "New", label: "New" },
  { value: "Selected", label: "Selected" },
  { value: "Rejected", label: "Rejected" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Scheduled", label: "Scheduled" },
];

const CandidatesTable = ({
  data = [],
  onActionClick,
  className = "",
}) => {
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

  const handleActionClick = (action, rowData, rowIndex) => {
    setOpenActionDropdown(null);
    console.log(action, rowIndex, rowData);
    if (onActionClick) {
      onActionClick(action, rowData, rowIndex);
    }
  };

  const toggleActionDropdown = (rowIndex, event) => {
    if (openActionDropdown === rowIndex) {
      setOpenActionDropdown(null)
    } else {
      setOpenActionDropdown(rowIndex)
      // Calculate position for fixed dropdown
      const rect = event.currentTarget.getBoundingClientRect()
      const dropdown = dropdownRefs.current[rowIndex]?.querySelector(".action-dropdown")
      if (dropdown) {
        dropdown.style.top = `${rect.bottom + window.scrollY + 4}px`
        dropdown.style.left = `${rect.right + window.scrollX - 160}px` // 160px is dropdown width
      }
    }
  }

  const handleStatusChange = async (rowIndex, option) => {
    const candidate = data[rowIndex];
    dispatch(updateCandidate({ id: candidate._id, updateData: {status: option.value} }));
  };

  const actions = [
    {
      label: "Download Resume",
      icon: Download,
      action: "download",
    },
    {
      label: "Delete Candidate",
      icon: Trash2,
      action: "delete",
    },
  ];

  return (
    <div className={`candidates-table-container ${className}`}>
      <div className="table-wrapper">
        <table className="candidates-table">
          <thead>
            <tr>
              <th className="table-header center">Sr no.</th>
              <th className="table-header left">Candidates Name</th>
              <th className="table-header left">Email Address</th>
              <th className="table-header left">Phone Number</th>
              <th className="table-header left">Position</th>
              <th className="table-header center">Status</th>
              <th className="table-header center">Experience</th>
              <th className="table-header center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((candidate, rowIndex) => (
              <tr key={rowIndex} className="table-row">
                <td className="table-cell center">{rowIndex + 1}</td>
                <td className="table-cell left">{candidate?.name}</td>
                <td className="table-cell left">{candidate?.email}</td>
                <td className="table-cell left">{candidate?.phone}</td>
                <td className="table-cell left">{candidate.position}</td>
                <td className="table-cell center">
                  <StatusDropdown
                    options={candidateStatusOptions}
                    value={candidate.status}
                    onChange={(option) => handleStatusChange(rowIndex, option)}
                  />
                </td>
                <td className="table-cell center">{candidate.experience}</td>
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
                              handleActionClick(action, candidate, rowIndex)
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
            <p>No candidates found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesTable;
