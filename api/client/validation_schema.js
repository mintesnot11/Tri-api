// Joi
const Joi = require("joi");

exports.signupSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  address: Joi.string(),
  pin: Joi.string().required(),
  pin_confirm: Joi.string().required(),
  accept_policy: Joi.boolean().required(),
});

exports.clientLoginSchema = Joi.object({
  phone_number: Joi.string().required(),
  pin: Joi.string().required(),
});

exports.updatePinSchema = Joi.object({
  current_pin: Joi.string().required(),
  pin: Joi.string().required(),
  pin_confirm: Joi.string().required(),
});

exports.pinResetSchema = Joi.object({
  pin: Joi.string().required(),
  pin_confirm: Joi.string().required(),
  client_id: Joi.string().required(),
});
