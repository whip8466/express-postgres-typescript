import Joi = require("joi");
import { passwordValidation, phoneValidation } from "./custom.validation";
import httpMessages from "../config/httpMessages";

export const registerValidation = {
  body: Joi.object().keys({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    gender: Joi.string().trim().required(),
    dateOfBirth: Joi.string().optional().allow(""),
    stateId: Joi.number().optional().allow(""),
    email: Joi.string().trim().required().email(),
    phone: Joi.string().optional().allow("").custom(phoneValidation),
    password: Joi.string().trim().required().custom(passwordValidation),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .messages({ "any.only": httpMessages.REGISTER.PASSWORD_MISMATCH })
  })
};

export const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required()
  })
};

export const ssoLoginValidation = {
  body: Joi.object().keys({
    code: Joi.string().trim().required()
  })
};

export const logoutValidation = {
  body: Joi.object().keys({
    refreshToken: Joi.string().trim().required()
  })
};

export const refreshTokensValidation = {
  body: Joi.object().keys({
    refreshToken: Joi.string().trim().required()
  })
};

export const forgotPasswordValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().trim().required()
  })
};

export const resetPasswordValidation = {
  query: Joi.object().keys({
    token: Joi.string().trim().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().trim().required().custom(passwordValidation),
    confirmPassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .messages({ "any.only": httpMessages.REGISTER.PASSWORD_MISMATCH })
  })
};

export const verifyEmailValidation = {
  query: Joi.object().keys({
    token: Joi.string().trim().required()
  })
};
