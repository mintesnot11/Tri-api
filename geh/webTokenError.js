// App Error
const AppError = require("../utils/appError");

// Handle invalid token related error
module.exports = (err) => {
  // Message
  let message =
    "We have detected invalid authentication token. Please login again";

  return new AppError(message, 400);
};
