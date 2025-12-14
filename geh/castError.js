// App Error
const AppError = require("../utils/appError");

// Handle cast error
module.exports = (err) => {
  // Create a message
  const message = "Resource can not be found";
  return new AppError(message, 400);
};
