// Joi
const Joi = require("joi");

exports.createEventSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});
