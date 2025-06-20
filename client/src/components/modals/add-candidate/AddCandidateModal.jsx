"use client";

import { useForm, Controller } from "react-hook-form";
import "./AddCandidateModal.css";
import Input from "../../Tags/input/Input";
import FileUpload from "../../Tags/file-upload/FileUpload";
import Button from "../../Tags/button/Button";
import Modal from "../Modal";

const AddCandidateModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      resume: null,
      declaration: false,
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();

      for (const key in data) {
        if (key === "resume" && data.resume) {
          // If resume is a File object
          formData.append("resume", data.resume);
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
      title="Add New Candidate"
      className="add-candidate-modal"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="candidate-form"
      >
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
              name="position"
              control={control}
              rules={{ required: "Position is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Position"
                  error={!!errors.position}
                  required
                />
              )}
            />
            {errors.position && (
              <span className="error-message">{errors.position.message}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <Controller
              name="experience"
              control={control}
              rules={{ required: "Experience is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Experience"
                  error={!!errors.experience}
                  required
                />
              )}
            />
            {errors.experience && (
              <span className="error-message">{errors.experience.message}</span>
            )}
          </div>

          <div className="form-group">
            <Controller
              name="resume"
              control={control}
              rules={{ required: "Resume is required" }}
              render={({ field: { onChange, value } }) => (
                <FileUpload
                  onFileChange={onChange}
                  accept=".pdf,.doc,.docx"
                  placeholder="Resume"
                  error={!!errors.resume}
                />
              )}
            />
            {errors.resume && (
              <span className="error-message">{errors.resume.message}</span>
            )}
          </div>
        </div>

        <div className="form-group checkbox-group">
          <Controller
            name="declaration"
            control={control}
            rules={{ required: "Please accept the declaration" }}
            render={({ field: { onChange, value } }) => (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={onChange}
                  className="checkbox-input"
                />
                <span className="checkbox-text">
                  I hereby declare that the above information is true to the
                  best of my knowledge and belief
                </span>
              </label>
            )}
          />
          {errors.declaration && (
            <span className="error-message">{errors.declaration.message}</span>
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

export default AddCandidateModal;
