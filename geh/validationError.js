// App Error
const AppError = require("../utils/appError");

// Handle validation error
module.exports = (err) => {
  // Create a message
  let message = Object.values(err.errors)
    .map((val) => val.message)
    .join(", ");
  return new AppError(message, 400);
};
