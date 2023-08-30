import httpStatus from "http-status";
import bcrypt from "bcrypt";

import ApiError from "../../utils/ApiError";
import httpMessages from "../../config/httpMessages";
const { ROLES } = require("../../database/config/roles");

import User from "../../database/models/user.model";
import Role from "../../database/models/role.model";
import UserRole from "../../database/models/userRoles.model";

export default class UserService {
  constructor() {}

  /**
   * Get user by email
   * @param {string} email
   * @param {any} options
   * @returns {Promise<User>}
   */
  static getUserByEmail = async (email: string, options: any = {}) => {
    const { shouldReturnPassword = false } = options;

    let excludeAttr: string[] = [];
    if (!shouldReturnPassword) {
      excludeAttr = ["password"];
    }

    return User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
      attributes: {
        exclude: excludeAttr,
      },
    });
  };

  /**
   * Get user
   * @param {any} whereOptions
   * @returns {Promise<User>}
   */
  static getUser = async (whereOptions: any = {}) => {
    return User.findOne({
      where: whereOptions,
      attributes: {
        exclude: ["password"],
      },
    });
  };

  /**
   * Create a user
   * @param {Object} userBody
   * @returns {Promise<User>}
   */
  static createUser = async (userBody: any) => {
    try {
      if (userBody.password !== userBody.confirmPassword) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          httpMessages.REGISTER.PASSWORD_MISMATCH
        );
      } else if (await this.getUserByEmail(userBody.email)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          httpMessages.REGISTER.EMAIL_ALREADY_TAKEN
        );
      }

      const user: User = await User.create(userBody);
      const role: any = await this.getRole(ROLES.CUSTOMER);
      await UserRole.create({
        userId: user.id,
        roleId: role.id,
      });

      return this.getUserByEmail(user.email).then((data: any) =>
        data?.toJSON()
      );
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  static getRole = async (roleName: string) => {
    return await Role.findOne({
      where: { roleName },
    });
  };

  /**
   * Return users
   * @returns {Promise<User[]>}
   */
  static getUsers = async () => {
    try {
      const users = User.findAll({
        include: [
          {
            model: Role,
            attributes: ["roleName"],
            through: { attributes: [] },
          },
        ],
        attributes: { exclude: ["password"] },
      });

      return users;
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  /**
   * Get user by id
   * @param {Number} id
   * @returns {Promise<User>}
   */
  static getUserById = async (id: number) => {
    return User.findByPk(id);
  };

  /**
   * Get user by id
   * @param {number} id
   * @returns {Promise<User>}
   */
  static getUserByIdWithRoles = async (id: number): Promise<any> => {
    return User.findOne({
      where: { id },
      include: [
        {
          model: Role,
          through: { attributes: [] },
        },
      ],
    }).then((data: any) => data?.toJSON());
  };

  /**
   * Update user by id
   * @param {Number} userId
   * @param {Object} updateBody
   * @returns {Promise<User>}
   */
  static updateUserById = async (userId: number, updateBody: any) => {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, httpMessages.USER.NOT_FOUND);
    }
    if (updateBody.email) {
      const userByEmail: any = await this.getUserByEmail(updateBody.email);
      if (userId === userByEmail.id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
      }
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  };

  /**
   * Update user by id
   * @param {Number} userId
   * @param {Object} userProfile
   * @returns {Promise<User>}
   */
  static updateUserByProfile = async (userId: number, userProfile: any) => {
    if (userProfile.email) {
      const fetchedUser: any = await this.getUserByEmail(userProfile.email);
      if (fetchedUser.id != userId) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          httpMessages.REGISTER.EMAIL_ALREADY_TAKEN
        );
      }
    }

    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    Object.assign(user, userProfile);
    const updatedUser = Object.assign(await user.save());
    updatedUser.password = undefined;

    return updatedUser;
  };

  /**
   * Delete user by id
   * @param {Number} userId
   * @returns {Promise<User>}
   */
  static deleteUserById = async (userId: number) => {
    const user: any = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await user.remove();
    return user;
  };

  /**
   * Update password
   * @param {string} userId
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise<Address>}
   */
  static updatePassword = async (
    userId: number,
    oldPassword: string,
    newPassword: string
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await this.getUserById(userId);
        return bcrypt.compare(
          oldPassword,
          user.password,
          async (err: any, res: any) => {
            if (err) {
              return reject(new ApiError(httpStatus.NOT_FOUND, err?.message));
            }
            if (res) {
              const bcryptedPassword = await bcrypt.hash(newPassword, 8);
              Object.assign(user, { password: bcryptedPassword });
              return resolve(await user.save());
            } else {
              return reject(
                new ApiError(
                  httpStatus.BAD_REQUEST,
                  httpMessages.USER.PROFILE.PASSWORD_DOES_NOT_MATCH
                )
              );
            }
          }
        );
      } catch (error: any) {
        return reject(new ApiError(httpStatus.BAD_REQUEST, error.message));
      }
    });
  };

}
