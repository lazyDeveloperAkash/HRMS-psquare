const Leave = require("../models/Leave");
const { sendRes } = require("../utils/SendRes");
const {catchAsyncErrors} = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Candidate = require("../models/Candidate");

// Create Leave
exports.createLeave = catchAsyncErrors(async (req, res, next) => {
  const { employee: employeeId, reason, appliedDate, designation } = req.body;

  const employee = await Candidate.findById(employeeId).select("attendance");

  if(!employee){
    return next(new ErrorHandler("Candidate not found", 400));
  }

  if(employee.attendance !== "Present"){
    return next(new ErrorHandler("Candidate is Absent", 400));
  }

  console.log(req.file);

  const documentFile = req.file;

  const leave = new Leave({
    employee: employeeId,
    reason,
    appliedDate,
    designation,
    document: documentFile
      ? {
          filename: documentFile.filename,
          path: documentFile.path,
          mimetype: documentFile.mimetype,
          size: documentFile.size,
        }
      : undefined,
  });

  await leave.save();

  const newLeave = await Leave.findById(leave._id).populate("employee", "name email phone");

  sendRes(201, res, newLeave, "Leave request created successfully");
});

// Read All Leaves
exports.getAllLeaves = catchAsyncErrors(async (req, res, next) => {
  const leaves = await Leave.find()
    .populate("employee", "name email phone")
    // .populate("approvedBy", "name email")
    .sort({ appliedDate: -1 });

  sendRes(200, res, leaves, "Leave requests fetched successfully");
});

// Update Leave Status Only
exports.updateLeaveStatus = catchAsyncErrors(async (req, res, next) => {
  const leaveId = req.params.id;
  const { status } = req.body;

  const leave = await Leave.findById(leaveId);
  if (!leave) {
    return next(new ErrorHandler("Leave request not found", 404));
  }

  leave.status = status;
  leave.approvedBy = req.user._id;
  leave.approvedDate = new Date();

  await leave.save();
  const newLeave = await Leave.findById(leave._id).populate("employee", "name email phone");

  sendRes(200, res, newLeave, "Leave request status updated successfully");
});
