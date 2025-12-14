// Joi
const Joi = require("joi");

exports.sendOtpSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  address: Joi.string(),
});

exports.verifyOtpSchema = Joi.object({
  phone_number: Joi.string().required(),
  otp: Joi.string().required(),
});
