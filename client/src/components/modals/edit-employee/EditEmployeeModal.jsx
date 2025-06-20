"use client";

import { useForm, Controller } from "react-hook-form";
import "./EditEmployeeModal.css";
import Modal from "../Modal";
import Input from "../../Tags/input/Input";
import Button from "../../Tags/button/Button";
import DatePicker from "../../Tags/date-picker/DatePicker";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const EditEmployeeModal = ({
  isOpen,
  onClose,
  onSubmit,
  employeeData = {},
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: employeeData?.name || "",
      email: employeeData?.email || "",
      phone: employeeData?.phone || "",
      department: employeeData?.department || "",
      position: employeeData?.position || "",
      joiningDate: employeeData?.joiningDate || "",
    },
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    if (employeeData) {
      reset({
        name: employeeData.name || "",
        email: employeeData.email || "",
        phone: employeeData.phone || "",
        department: employeeData.department || "",
        position: employeeData.position || "",
        joiningDate: employeeData.joiningDate || "",
      });
    }
  }, [employeeData, reset]);

  const positionOptions = [
    { value: "Intern", label: "Intern" },
    { value: "Junior", label: "Junior" },
    { value: "Senior", label: "Senior" },
    { value: "Team Lead", label: "Team Lead" },
    { value: "Manager", label: "Manager" },
  ];

  const handleFormSubmit = async (data) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    reset()
    setIsDropdownOpen(false)
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleDropdownSelect = (value, onChange) => {
    onChange(value)
    setIsDropdownOpen(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Employee Details"
      className="edit-employee-modal"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="employee-form">
        <div className="form-row">
          <div className="form-group">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Full Name"
                  error={!!errors.name}
                  required
                />
              )}
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email address is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Email Address"
                  error={!!errors.email}
                  required
                />
              )}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <Controller
              name="phone"
              control={control}
              rules={{ required: "Phone number is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="tel"
                  placeholder="Phone Number"
                  error={!!errors.phone}
                  required
                />
              )}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone.message}</span>
            )}
          </div>

          <div className="form-group">
            <Controller
              name="department"
              control={control}
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Department"
                  error={!!errors.department}
                  required
                />
              )}
            />
            {errors.department && (
              <span className="error-message">{errors.department.message}</span>
            )}
          </div>
        </div>

        <div className="form-row">
        <div className="form-group">
          <Controller
            name="joiningDate"
            control={control}
            rules={{ required: "Date of joining is required" }}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                value={value}
                onChange={onChange}
                placeholder="Date of Joining"
                error={!!errors.joiningDate}
              />
            )}
          />
          {errors.joiningDate && (
            <span className="error-message">{errors.joiningDate.message}</span>
          )}
        </div>
        {/* <div className="form-row"> */}
          <div className="form-group">
            {/* <label htmlFor="position">Position *</label> */}
            <Controller
              name="position"
              control={control}
              rules={{ required: "Position is required" }}
              render={({ field: { onChange, value } }) => (
                <div
                  className={`custom-dropdown ${isDropdownOpen ? "open" : ""}`}
                >
                  <button
                    type="button"
                    className={`dropdown-toggle ${
                      errors.position ? "error" : ""
                    }`}
                    onClick={handleDropdownToggle}
                  >
                    <span
                      className={`dropdown-text ${!value ? "placeholder" : ""}`}
                    >
                      {value
                        ? positionOptions.find((opt) => opt.value === value)
                            ?.label
                        : "Select position"}
                    </span>
                    <span className="dropdown-arrow"><ChevronDown/></span>
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {positionOptions.map((option) => (
                        <div
                          key={option.value}
                          className="dropdown-item"
                          onClick={() =>
                            handleDropdownSelect(option.value, onChange)
                          }
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            />
            {errors.position && (
              <span className="error-message">{errors.position.message}</span>
            )}
          </div>
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

export default EditEmployeeModal;
