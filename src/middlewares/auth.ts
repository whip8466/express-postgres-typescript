import { Response, NextFunction } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError";
import { config } from "../config/config";
import errorResponse from "../utils/response";
const { ROLE_RIGHTS, ROLES } = require("../database/config/roles");

import UserService from "../app/user/user.service";
import httpMessages from "../config/httpMessages";

export const auth = async (
  request: any,
  response: Response,
  next: NextFunction
) => {
  return new Promise<void>((resolve, reject) => {
    (async () => {
      try {
        const authorization: string | undefined = request.headers.authorization;
        const token: string = authorization?.split(" ")[1] || "";
        const decoded: any = jwt.verify(token, config.jwt.secret);
        const userId: number = decoded.sub;
        const user = await UserService.getUserByIdWithRoles(userId);

        if (user) {
          request.user = user;
          const baseUrl = request.baseUrl.replace("/v1", "");
          const currentURL = baseUrl + request.route.path;
          const userRoles = user?.roles?.map((roles: any) => roles.roleName);
          request.user.isAdmin = userRoles.includes(ROLES.ADMIN);
          request.user.isCustomer = userRoles.includes(ROLES.CUSTOMER);

          if (
            ROLE_RIGHTS.ADMIN.includes(currentURL) &&
            !userRoles.includes(ROLES.ADMIN)
          ) {
            return reject(
              errorResponse(
                response,
                new ApiError(
                  httpStatus.FORBIDDEN,
                  httpMessages.USER.AUTH.FORBIDDEN
                )
              )
            );
          }
          resolve();
        } else {
          return reject(
            errorResponse(
              response,
              new ApiError(
                httpStatus.UNAUTHORIZED,
                httpMessages.USER.AUTH.UNAUTHORIZED
              )
            )
          );
        }
      } catch (e) {
        return errorResponse(
          response,
          new ApiError(
            httpStatus.UNAUTHORIZED,
            httpMessages.USER.AUTH.UNAUTHORIZED
          )
        );
      }
    })();
  })
    .then(() => next())
    .catch((err) => next(err));
};
