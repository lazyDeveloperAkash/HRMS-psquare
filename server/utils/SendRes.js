exports.sendRes = (statusCode = 200, res, data = null, message = "") => {
  res.status(statusCode).json({
    status: true,
    data: data,
    message: message,
  });
};