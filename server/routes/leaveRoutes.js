const express = require("express");
const { body } = require("express-validator");
const { upload } = require("../services/uploadService");
const authenticate = require("../middleware/auth");
const { validateRequest } = require("../middleware/validator");
const {
  createLeave,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

const router = express.Router();

// Validation middleware for create
const leaveValidation = [
  body("employee").notEmpty().withMessage("EmployeeId is required"),
  body("reason").notEmpty().withMessage("Reason is required"),
  body("appliedDate").notEmpty().withMessage("Applied Date is required"),
  body("designation").notEmpty().withMessage("Designation is required"),
  validateRequest,
];

// Create Leave
router.post("/", authenticate, upload.single("document"), leaveValidation, createLeave);

// Read All Leaves
router.get("/", authenticate, getAllLeaves);

// Update Status only
router.patch("/:id/status", authenticate, [
  body("status")
    .isIn(["Pending", "Approved", "Rejected"])
    .withMessage("Status must be Pending, Approved or Rejected"),
  validateRequest,
], updateLeaveStatus);

module.exports = router;
