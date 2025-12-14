// Custom app error
const AppError = function (message, statusCode) {
  Error.call(this, message);
  this.message = message;
  this.statusCode = statusCode;
  this.status = `${this.statusCode}`.startsWith("4") ? "FAIL" : "ERROR";
  this.isOperational = true;

  // Error stack
  Error.captureStackTrace(this, this.constructor);
};

// Export App Error
module.exports = AppError;
