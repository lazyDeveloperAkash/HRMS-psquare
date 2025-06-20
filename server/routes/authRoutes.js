const express = require("express");
const { body } = require("express-validator");
const authenticate = require("../middleware/auth");
const { validateRequest } = require("../middleware/validator");
const {
  register,
  login,
  loggedInUser,
  logout,
} = require("../controllers/authController");

const router = express.Router();

// Validation middleware
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  validateRequest,
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
];

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/user", authenticate, loggedInUser);
router.get("/logout", authenticate, logout);

module.exports = router;
