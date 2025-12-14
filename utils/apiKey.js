// Configs
const configs = require("../configs");

// App Error
const AppError = require("../utils/appError");

// API Key middleware
module.exports = (req, res, next) => {
  // Get the api key
  const apiKey = req.headers["x-api-key"];

  // Check if there is an API Key
  if (!apiKey) return next(new AppError("Please provide the API Key", 400));

  // Check the api key
  if (apiKey !== configs.api_key)
    return next(
      new AppError("Invalid API Key. Make sure to use the right API Key.", 400)
    );

  next();
};
