// App Error
const AppError = require("../utils/appError");

// Handle token expire error
module.exports = (err) => {
  // Message
  let message = "It is been long since you use this service. Please login.";

  return new AppError(message, 400);
};
