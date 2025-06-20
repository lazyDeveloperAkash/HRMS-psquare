const jwt = require("jsonwebtoken")
const User = require("../models/User");
const ErrorHandler = require("../utils/ErrorHandler");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new ErrorHandler("No token, authenticateorization denied", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hrms_secret")
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new ErrorHandler("Token is not valid", 401));
    }

    req.userId = decoded.userId
    req.user = user
    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired", 401));
    }
    return next(new ErrorHandler("Token is not valid", 401));
  }
}

module.exports = authenticate;
