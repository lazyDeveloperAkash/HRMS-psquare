import { useForm, Controller } from "react-hook-form";
import Modal from "../Modal";
import "./AddLeaveModal.css";
import Input from "../../Tags/input/Input";
import DatePicker from "../../Tags/date-picker/DatePicker";
import FileUpload from "../../Tags/file-upload/FileUpload";
import Button from "../../Tags/button/Button";
import { useSelector } from "react-redux";
import UserSearchInput from "../../Tags/input/UserSearchInput";

const AddLeaveModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      employee: null,
      designation: "",
      appliedDate: "",
      document: null,
      reason: "",
    },
  });

  const { candidates } = useSelector((state) => state.candidate);
  const employees = candidates.filter(
    (candidate) =>
      candidate.status === "Selected" && candidate.attendance === "Present"
  );

  const handleFormSubmit = async (data) => {
    try {
      const id = data.employee._id;
      data.employee = id;
      const formData = new FormData();
      console.log(data);

      for (const key in data) {
        if (key === "document" && data.document) {
          // If document is a File object
          formData.append("document", data.document);
        } else {
          formData.append(key, data[key]);
        }
      }
      if (onSubmit) {
        await onSubmit(formData);
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Leave"
      className="add-leave-modal"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="leave-form">
        <div className="form-row">
          <div className="form-group">
            <Controller
              name="employee"
              control={control}
              rules={{ required: "Please select an Employee" }}
              render={({ field }) => (
                <UserSearchInput
                  users={employees}
                  value={field.value}
                  onUserSelect={(selectedUser) => {
                    console.log(selectedUser);
                    field.onChange(selectedUser);
                    setValue("designation", selectedUser?.position || "");
                  }}
                  placeholder="Search Employee Name"
                />
              )}
            />

            {errors.employee && (
              <span className="error-message">{errors.employee.message}</span>
            )}
          </div>

          <div className="form-group">
            <Controller
              name="designation"
              control={control}
              rules={{ required: "Designation is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Designation"
                  error={!!errors.designation}
                  required
                />
              )}
            />
            {errors.designation && (
              <span className="error-message">
                {errors.designation.message}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <Controller
              name="appliedDate"
              control={control}
              rules={{ required: "Leave date is required" }}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  placeholder="Leave Date"
                  error={!!errors.appliedDate}
                />
              )}
            />
            {errors.appliedDate && (
              <span className="error-message">
                {errors.appliedDate.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <Controller
              name="document"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FileUpload
                  onFileChange={onChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  placeholder="Document"
                  error={!!errors.document}
                />
              )}
            />
            {errors.document && (
              <span className="error-message">{errors.document.message}</span>
            )}
          </div>
        </div>

        <div className="form-group full-width">
          <Controller
            name="reason"
            control={control}
            rules={{ required: "Reason is required" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Reason"
                error={!!errors.reason}
                required
              />
            )}
          />
          {errors.reason && (
            <span className="error-message">{errors.reason.message}</span>
          )}
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="save-button"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddLeaveModal;
