import Joi from "joi";
export const loginForm = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const registerForm = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.string().optional(),
});
export const emailForm = Joi.object({
  email: Joi.string().email().required(),
});
