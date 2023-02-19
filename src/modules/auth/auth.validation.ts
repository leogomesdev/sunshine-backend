import Joi from "joi";
import { password } from "../../validate/custom.validation";

/**
 * Rules for register request body
 */
const registerBody = {
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  passwordConfirmation: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "passwordConfirmation must match password",
    }),
};

/**
 * Validation for register request
 */
export const register = {
  body: Joi.object().keys(registerBody),
};

/**
 * Validation for login request
 */
export const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};
