// Configs
const configs = require("../configs");

// Dev Error
const devError = require("./devError");

// Prod Error
const prodError = require("./prodError");

// Duplication error
const duplicationError = require("./duplicationError");

// Validation
const validationError = require("./validationError");

// Cast error
const castError = require("./castError");

// Web token error
const webTokenError = require("./webTokenError");

// Token expired error
const tokenExpiredError = require("./tokenExpiredError");

// GEH - Global error handler
module.exports = (err, req, res, next) => {
  // Get the error object or use default
  err.status = err.status || "ERROR";
  err.statusCode = err.statusCode || 500;

  // Dev or Prod error
  if (configs.env === "development") {
    devError(err, res);
  } else if (configs.env === "production" || configs.env === "qa") {
    // Handle different types of errors
    if (err.code === 11000) err = duplicationError(err);
    else if (err.name === "ValidationError") err = validationError(err);
    else if (err.name === "CastError") err = castError(err);
    else if (err.name === "JsonWebTokenError") err = webTokenError(err);
    else if (err.name === "TokenExpiredError") err = tokenExpiredError(err);
    prodError(err, res);
  } else {
    res.status(500).json({
      status: "ERROR",
      message: "Unknown environment",
    });
  }
};
