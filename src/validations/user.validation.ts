import Joi = require("joi");

export const profileUpdate = {
  body: Joi.object().keys({
    firstName: Joi.string().optional().allow(''),
    lastName: Joi.string().optional().allow(''),
    dateOfBirth: Joi.string().optional().allow(''),
    stateId: Joi.number().optional().allow(''),
  })
};
