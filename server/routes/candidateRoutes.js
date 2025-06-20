const express = require("express");
const { body } = require("express-validator");
const { upload } = require("../services/uploadService");
const authenticate = require("../middleware/auth");
const { validateRequest } = require("../middleware/validator");
const {
  createCandidate,
  getAllCandidates,
  updateCandidate,
  deleteCandidate,
} = require("../controllers/candidateController");

const router = express.Router();

// Validation middleware
const candidateValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("phone")
    .matches(/^\d{10}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
  body("position").notEmpty().withMessage("Position is required"),
  body("experience")
    .isNumeric()
    .withMessage("Experience must be a number")
    .custom((value) => value >= 0)
    .withMessage("Experience cannot be negative"),
  validateRequest,
];

// Create candidate
router.post(
  "/",
  authenticate,
  upload.single("resume"),
  candidateValidation,
  createCandidate
);

// Read all candidates
router.get("/", authenticate, getAllCandidates);

// Update candidate — PATCH style — only update provided fields
router.patch(
  "/:id",
  authenticate,
  updateCandidate
);

// delete
router.delete(
  "/:id",
  authenticate,
  deleteCandidate
);

module.exports = router;
