// Joi
const Joi = require("joi");

exports.createAdSchema = Joi.object({
  company_name: Joi.string().required(),
  expire_date: Joi.date().required(),
  image: Joi.object({
    image: Joi.string().required(),
    public_id: Joi.string().required(),
  }).required(),
  spot_label: Joi.string().required(),
});

exports.updateAdSchema = Joi.object({
  company_name: Joi.string().required(),
  expire_date: Joi.date().required(),
  spot_label: Joi.string().required(),
});

exports.updateAdImageSchema = Joi.object({
  image: Joi.object({
    image: Joi.string().required(),
    public_id: Joi.string().required(),
  }).required(),
});
