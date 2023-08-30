import { Request, Response } from "express";
import httpStatus from "http-status";

import errorResponse from "../../utils/response";
import catchAsync from "../../utils/catchAsync";
import httpMessages from "../../config/httpMessages";

import AuthService from "./auth.service";
import UserService from "../user/user.service";
import TokenService from "./token.service";
import { getContentLanguage } from "../../utils/util";

export default class AuthController {
  static authService = AuthService;
  static userService = UserService;
  static tokenService = TokenService;

  constructor() {}

  static register = catchAsync(async (request: Request, response: Response) => {
    try {
      const language: string = getContentLanguage(request);
      const userData = { ...request.body, lang: language };
      const user = await this.userService.createUser(userData);
      const tokens = await this.tokenService.generateAuthTokens(user);
      const data = { user: { ...user, tokens } };
      return response.status(httpStatus.CREATED).send({
        success: true,
        message: httpMessages.REGISTER.SUCCESS,
        data
      });
    } catch (error) {
      return errorResponse(response, error);
    }
  });

  static login = catchAsync(async (request: Request, response: Response) => {
    try {
      const { email, password } = request.body;
      const user = await this.authService.loginUserWithEmailAndPassword(
        email,
        password
      );
      const tokens = await this.tokenService.generateAuthTokens(user);
      const data = { user: { ...user, tokens } };
      return response.status(httpStatus.CREATED).send({
        success: true,
        message: httpMessages.LOGIN.SUCCESS,
        data
      });
    } catch (error) {
      return errorResponse(response, error);
    }
  });

  static logout = catchAsync(async (request: Request, response: Response) => {
    try {
      const { refreshToken }: any = request.body;
      await this.authService.logout(refreshToken);
      return response.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
      return errorResponse(response, error);
    }
  });

  static refreshTokens = catchAsync(
    async (request: Request, response: Response) => {
      try {
        const tokens = await this.authService.refreshAuth(
          request.body.refreshToken
        );
        const data = { ...tokens };
        return response.status(httpStatus.CREATED).send({
          success: true,
          message: httpMessages.REFRESH_TOKEN_SUCCESS,
          data
        });
      } catch (error) {
        return errorResponse(response, error);
      }
    }
  );

  static forgotPassword = catchAsync(
    async (request: Request, response: Response) => {
      try {
        const resetPasswordToken =
          await this.tokenService.generateResetPasswordToken(
            request.body.email
          );
        console.log(">>>>>> forgotPassword: ", {
          email: request.body.email,
          resetPasswordToken
        });

        // await emailService.sendResetPasswordEmail(
        //   request.body.email,
        //   resetPasswordToken
        // );
        return response.status(httpStatus.NO_CONTENT).send();
      } catch (error) {
        return errorResponse(response, error);
      }
    }
  );

  static resetPassword = catchAsync(
    async (request: Request, response: Response) => {
      try {
        const { body, query } = request;
        const { token } = query;
        await this.authService.resetPassword(token, body.password || "");
        return response.status(httpStatus.OK).send({
          success: true,
          message: httpMessages.USER.PROFILE.RESET_PASSWORD_SUCCESS
        });
      } catch (error) {
        return errorResponse(response, error);
      }
    }
  );

  // static sendVerificationEmail = catchAsync(async (request: Request, response: Response) => {
  //   const verifyEmailToken = await this.tokenService.generateVerifyEmailToken(
  //     request.user
  //   );
  //   await emailService.sendVerificationEmail(request.user.email, verifyEmailToken);
  //   return response.status(httpStatus.NO_CONTENT).send();
  // });

  // static verifyEmail = catchAsync(async (request: Request, response: Response) => {
  //   await this.authService.verifyEmail(request.query.token);
  //   return response.status(httpStatus.NO_CONTENT).send();
  // });
}
