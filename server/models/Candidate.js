const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      // enum: ["Intern", "Full Time", "Junior", "Senior", "Team Lead"],
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    resume: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
    },
    status: {
      type: String,
      enum: ["New", "Scheduled", "Ongoing", "Selected", "Rejected"],
      default: "New",
    },
    department: {
      type: String,
      default: ""
    },
    joiningDate: {
      type: Date
    },
    designation: {
      type: String,
      default: ""
    },
    attendance: {
      type: String,
      enum: ["Present", "Absent"],
    }
  },
  {
    timestamps: true,
  }
);

candidateSchema.index({ status: 1 });
candidateSchema.index({ position: 1 });

module.exports = mongoose.model("Candidate", candidateSchema);
