const Joi = require("joi");

const validateUserRegistration = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(4).max(50).optional(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const validateUserLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports = { validateUserRegistration, validateUserLogin };
