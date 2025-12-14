// Joi
const Joi = require("joi");

// App Error
const AppError = require("./appError");

// Validator
module.exports = (schema) => {
  return (req, res, next) => {
    // Get body
    const body = req.body;

    // Validate
    const { error, value } = schema.validate(body);

    if (error) return next(new AppError(error.message, 400));

    req.value = value;
    next();
  };
};
