const Candidate = require("../models/Candidate");
const { sendRes } = require("../utils/SendRes");
const { catchAsyncErrors } = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler"); // your custom error handler

// Create
exports.createCandidate = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, position, experience } = req.body;

  const existingCandidate = await Candidate.findOne({ email });
  if (existingCandidate) {
    return next(
      new ErrorHandler("Candidate already exists with this email", 400)
    );
  }

  const resumeFile = req.file;
  console.log(req.file, "file");

  if (!resumeFile) {
    return next(new ErrorHandler("Please provide resume", 400));
  }

  const candidate = new Candidate({
    name,
    email,
    phone,
    position,
    experience,
    resume: resumeFile
      ? {
          filename: resumeFile.filename,
          path: resumeFile.path,
          mimetype: resumeFile.mimetype,
          size: resumeFile.size,
        }
      : undefined,
  });

  await candidate.save();

  sendRes(201, res, candidate, "Candidate created successfully");
});

// Read All
exports.getAllCandidates = catchAsyncErrors(async (req, res, next) => {
  const candidates = await Candidate.find().sort({ createdAt: -1 });
  sendRes(200, res, candidates, "Candidates fetched successfully");
});

// Update
exports.updateCandidate = catchAsyncErrors(async (req, res, next) => {
  const candidateId = req.params.id;

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    return next(new ErrorHandler("Candidate not found", 404));
  }

  // Update provided fields only
  const fieldsToUpdate = req.body;

  // Apply updates (merge)
  Object.keys(fieldsToUpdate).forEach((field) => {
    candidate[field] = fieldsToUpdate[field];
  });

  if (req.body.status === "Selected") {
    candidate.attendance = "Present";

    const today = new Date();
    const date = today.toISOString().split("T")[0];
    candidate.joiningDate = date;
  }

  await candidate.save();

  sendRes(200, res, candidate, "Candidate updated successfully");
});

// delete
exports.deleteCandidate = catchAsyncErrors(async (req, res, next) => {
  const candidateId = req.params.id;

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    return next(new ErrorHandler("Candidate not found", 404));
  }

  // Update delete candidate
  const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);

  sendRes(200, res, deletedCandidate, "Candidate deleted successfully");
});
