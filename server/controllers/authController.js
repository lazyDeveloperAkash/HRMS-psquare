const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("../middleware/catchAsyncErrors");
const { sendRes } = require("../utils/SendRes");

const signToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("token", token, cookieOptions);

  sendRes(statusCode, res, user, "");
};

exports.register = catchAsyncErrors(async (req, res, next) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email", 400));
  }

  const newUser = await new User({
    email,
    password,
    name,
  }).save();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Incorrect email", 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) return next(new ErrorHandler("Incorrect Password", 401));

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.clearCookie("token").status(200).json({ status: "success" });
};

exports.loggedInUser = catchAsyncErrors(async (req, res) => {
  sendRes(200, res, req.user, "");
});
