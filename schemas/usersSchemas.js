import Joi from "joi";
export const loginForm = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const registerForm = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
