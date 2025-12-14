// Logger
const logger = require("../utils/logger");

// Production environment error
module.exports = (error, res) => {
  // Check if the error is coming from our custom error module or class
  if (error.isOperational) {
    // Respond
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    logger.dev.error(error.message);
    res.status(500).json({
      status: "ERROR",
      message: "Opps!! Unknown error. Please try again",
    });
  }
};
