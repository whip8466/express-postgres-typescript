import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import moment from "moment";

import ApiError from "../../utils/ApiError";
import { config } from "../../config/config";
import httpMessages from "../../config/httpMessages";
const { TOKEN_TYPES } = require("../../database/config/enums");

import Token from "../../database/models/token.model";
import UserService from "../user/user.service";

export default class TokenService {
  static userService = UserService;

  constructor() {}

  /**
   * Generate token
   * @param {ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {string} [secret]
   * @returns {string}
   */
  static generateToken = (
    userId: number,
    expires: any,
    type: string,
    secret: string = config?.jwt?.secret
  ): string => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type
    };
    return `Bearer ${jwt.sign(payload, secret)}`;
  };

  /**
   * Get token by userId
   * @param {number} userId
   * @returns {Promise<Token>}
   */
  static getTokenByUser = (userId: number, type: string): Promise<any> =>
    Token.findOne({ where: { userId, type } });

  /**
   * Save a token
   * @param {string} token
   * @param {number} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {boolean} [blacklisted]
   * @returns {Promise<Token>}
   */
  static saveToken = async (
    token: string,
    userId: number,
    expires: any,
    type: string,
    blacklisted: boolean = false
  ): Promise<any> => {
    const tokenResponse = await this.getTokenByUser(userId, type);
    if (tokenResponse) {
      Object.assign(tokenResponse, {
        token,
        userId,
        expires: expires.toDate(),
        type,
        blacklisted
      });
      return await tokenResponse.save();
    } else {
      return await Token.create({
        token,
        userId,
        expires: expires.toDate(),
        type,
        blacklisted
      });
    }
  };

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  static generateAuthTokens = async (user: any) => {
    const userId = user?.id;

    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "minutes"
    );
    const accessToken = this.generateToken(
      userId,
      accessTokenExpires,
      TOKEN_TYPES.ACCESS
    );

    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days"
    );
    const refreshToken = this.generateToken(
      userId,
      refreshTokenExpires,
      TOKEN_TYPES.REFRESH
    );

    await this.saveToken(
      refreshToken,
      userId,
      refreshTokenExpires,
      TOKEN_TYPES.REFRESH
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate()
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate()
      }
    };
  };

  /**
   * Verify token and return token doc (or throw an error if it is not valid)
   * @param {string} bearerToken
   * @param {string} type
   * @returns {Promise<Token>}
   */
  static verifyToken = async (
    bearerToken: string,
    type: string
  ): Promise<any> => {
    const token = bearerToken.split(" ")[1];
    const payload = jwt.verify(token, config.jwt.secret);

    const tokenDoc = await Token.findOne({
      where: {
        token: bearerToken,
        type,
        userId: payload.sub,
        blacklisted: false
      }
    });

    if (!tokenDoc) {
      throw new Error(httpMessages.USER.AUTH.TOKEN.NOT_FOUND);
    }
    return tokenDoc;
  };

  /**
   * Generate reset password token
   * @param {string} email
   * @returns {Promise<string>}
   */
  static generateResetPasswordToken = async (email: string) => {
    const user: any = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        httpMessages.USER.EMAIL_NOT_FOUND
      );
    }
    const expires = moment().add(
      config.jwt.resetPasswordExpirationMinutes,
      "minutes"
    );
    const resetPasswordToken = this.generateToken(
      user.id,
      expires,
      TOKEN_TYPES.RESET_PASSWORD
    );
    await this.saveToken(
      resetPasswordToken,
      user.id,
      expires,
      TOKEN_TYPES.RESET_PASSWORD
    );
    return resetPasswordToken;
  };

  /**
   * Generate verify email token
   * @param {User} user
   * @returns {Promise<string>}
   */
  static generateVerifyEmailToken = async (user: any) => {
    const expires = moment().add(
      config.jwt.verifyEmailExpirationMinutes,
      "minutes"
    );
    const verifyEmailToken = this.generateToken(
      user.id,
      expires,
      TOKEN_TYPES.VERIFY_EMAIL
    );
    await this.saveToken(
      verifyEmailToken,
      user.id,
      expires,
      TOKEN_TYPES.VERIFY_EMAIL
    );
    return verifyEmailToken;
  };

  /**
   * Generate Access tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  static generateAccessToken = async (user: any) => {
    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "minutes"
    );
    const accessToken = this.generateToken(
      user.id,
      accessTokenExpires,
      TOKEN_TYPES.ACCESS
    );

    return {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    };
  };

}
