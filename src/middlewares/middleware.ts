import { Request, Response, NextFunction } from "express";
import Joi from 'joi';
import httpStatus from 'http-status';
import errorResponse from "../utils/response";
import ApiError from "../utils/ApiError";
import { pick } from "../utils/pick";


export const validate =
  (schema: any) =>
  (request: Request, response: Response, next: NextFunction) => {
    try {
      const validSchema = pick(schema, ["params", "query", "body"]);
      const object = pick(request, Object.keys(validSchema));
      const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: "key" }, abortEarly: false })
        .validate(object);

      if (error) {
        const errorMessage = error.details.map(
          (details: any) => details.message
        );
        return errorResponse(
          response,
          new ApiError(httpStatus.BAD_REQUEST, errorMessage)
        );
      }
      Object.assign(request, value);
      return next();
    } catch (error) {
      return errorResponse(response, error);
    }
  };
