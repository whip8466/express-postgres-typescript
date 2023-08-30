import httpStatus from "http-status";
import bcrypt from "bcrypt";

import ApiError from "../../utils/ApiError";
import UserService from "../user/user.service";
import TokenService from "./token.service";
import Token from "../../database/models/token.model";
import httpMessages from "../../config/httpMessages";
import { config } from "../../config/config";

const { TOKEN_TYPES } = require("../../database/config/enums");

export default class AuthService {
  static userService = UserService;
  static tokenService = TokenService;

  constructor() {}

  static isPasswordMatch = async (user: any, password: string) =>
    await bcrypt.compare(password, user.password);

  /**
   * Login with username and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  static loginUserWithEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    const user = await this.userService
      .getUserByEmail(email, { shouldReturnPassword: true })
      .then((data: any) => data?.toJSON());

    if (!user || !(await this.isPasswordMatch(user, password))) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        httpMessages.LOGIN.INCORRECT_EMAIL_OR_PASS
      );
    }
    user.password = undefined;
    return user;
  };

  /**
   * Logout
   * @param {string} refreshToken
   * @returns {Promise}
   */
  static logout = async (token: string) => {
    const refreshTokenDoc: any = await Token.findOne({
      where: {
        token,
        type: TOKEN_TYPES.REFRESH,
        blacklisted: false
      }
    });
    if (!refreshTokenDoc) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        httpMessages.REFRESH_TOKEN_ERROR
      );
    }
    await refreshTokenDoc.destroy();
  };

  /**
   * Refresh auth tokens
   * @param {string} refreshToken
   * @returns {Promise<Object>}
   */
  static refreshAuth = async (refreshToken: string) => {
    try {
      const refreshTokenDoc = await this.tokenService.verifyToken(
        refreshToken,
        TOKEN_TYPES.REFRESH
      );

      const user = await this.userService.getUserById(refreshTokenDoc.userId);
      if (!user) {
        throw new Error();
      }

      return this.tokenService.generateAccessToken(user);
    } catch (error) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        httpMessages.USER.AUTH.UNAUTHORIZED
      );
    }
  };

  /**
   * Reset password
   * @param {string} resetPasswordToken
   * @param {string} newPassword
   * @returns {Promise}
   */
  static resetPassword = async (
    resetPasswordToken: any,
    newPassword: string
  ) => {
    try {
      const resetPasswordTokenDoc = await this.tokenService.verifyToken(
        resetPasswordToken,
        TOKEN_TYPES.RESET_PASSWORD
      );
      const user: any = await this.userService.getUserById(
        resetPasswordTokenDoc.userId
      );

      if (!user) {
        throw new Error();
      }
      await this.userService.updateUserById(user.id, {
        ...user,
        password: newPassword
      });
      await Token.destroy({
        where: { userId: user.id, type: TOKEN_TYPES.RESET_PASSWORD }
      });
    } catch (error) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        httpMessages.USER.AUTH.UNAUTHORIZED
      );
    }
  };

  // /**
  //  * Verify email
  //  * @param {string} verifyEmailToken
  //  * @returns {Promise}
  //  */
  // static const verifyEmail = async (verifyEmailToken) => {
  //   try {
  //     const verifyEmailTokenDoc = await this.tokenService.verifyToken(verifyEmailToken, TOKEN_TYPES.VERIFY_EMAIL);
  //     const user = await this.userService.getUserById(verifyEmailTokenDoc.user);
  //     if (!user) {
  //       throw new Error();
  //     }
  //     await Token.destroy({ user: user.id, type: TOKEN_TYPES.VERIFY_EMAIL });
  //     await this.userService.updateUserById(user.id, { isEmailVerified: true });
  //   } catch (error) {
  //     throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  //   }
  // };
}
