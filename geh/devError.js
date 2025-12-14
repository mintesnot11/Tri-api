// Logger
const logger = require("../utils/logger");

// Development environment error
module.exports = (error, res) => {
  logger.dev.error(error.message);

  // Respond
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error,
    stack: error.stack,
  });
};
