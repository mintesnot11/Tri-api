// App Error
const AppError = require("../utils/appError");

// Duplication validation error
module.exports = (err) => {
  // Create a message
  let message = "";

  if (err.message.includes("phone_number")) {
    message = "This phone number is already used";
  } else if (err.message.includes("email")) {
    message = "This email is already used";
  } else if (err.message.includes("name")) {
    message = "This name is already used";
  }

  return new AppError(message, 400);
};
