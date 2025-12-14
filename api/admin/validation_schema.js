// Joi
const Joi = require("joi");

exports.createAdminSchema = Joi.object({
  first_name: Joi.string().max(1000).min(1).required(),
  last_name: Joi.string().max(1000).min(1).required(),
  phone_number: Joi.string().max(20).min(10).required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
});

exports.adminLoginSchema = Joi.object({
  email_or_phone: Joi.string().required(),
  password: Joi.string().required(),
});

exports.updateDefaultPasswordSchema = Joi.object({
  default_password: Joi.string().required(),
  password: Joi.string().required(),
  password_confirm: Joi.string().required(),
});

exports.resetAdminPasswordSchema = Joi.object({
  id: Joi.string().required(),
});

exports.updateAdminRoleSchema = Joi.object({
  role: Joi.string().required(),
});

exports.updateAdminPasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  password: Joi.string().required(),
  password_confirm: Joi.string().required(),
});
