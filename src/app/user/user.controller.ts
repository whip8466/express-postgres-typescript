import { Request, Response } from "express";
import httpStatus from "http-status";
import moment from "moment";

import catchAsync from "../../utils/catchAsync";
import errorResponse from "../../utils/response";
import ApiError from "../../utils/ApiError";
import httpMessages from "../../config/httpMessages";

import UserService from "./user.service";
import AddressService from "./address.service";
import AwsService from "../../common/services/aws.service";

export default class UserController {
  static userService = UserService;
  static addressService = AddressService;
  static awsService = AwsService;

  constructor() {}

  static getUsers = catchAsync(async (request: Request, response: Response) => {
    try {
      const users = await this.userService.getUsers();
      const data = { users };
      return response.status(httpStatus.CREATED).send({
        success: true,
        message: httpMessages.USER.SUCCESS,
        data
      });
    } catch (error: any) {
      return errorResponse(response, error);
    }
  });

  static getProfile = catchAsync(async (request: any, response: Response) => {
    try {
      const userId = request.user.id;
      const user: any = await this.userService.getUserById(userId);
      user.password = undefined;
      user.dcUserName = undefined;
      user.dcIsStaff = undefined;
      user.dcIsDoctor = undefined;
      user.dcDoctorId = undefined;
      user.dcPlanType = undefined;
      user.dcPracticeGroupId = undefined;

      const data = { user };
      return response.status(httpStatus.CREATED).send({
        success: true,
        message: httpMessages.USER.PROFILE.SUCCESS,
        data
      });
    } catch (error: any) {
      return errorResponse(response, error);
    }
  });

  static updateProfile = catchAsync(
    async (request: any, response: Response) => {
      try {
        const userProfile = request.body;
        const userId = request.user.id;

        if (userProfile.dateOfBirth) {
          const formattedDate = new Date(userProfile.dateOfBirth);
          const ageInDays = moment().diff(formattedDate, "days");

          const minAge = 25 * 365;
          const maxAge = 65 * 365;

          if (ageInDays < minAge || ageInDays > maxAge) {
            throw new ApiError(
              httpStatus.BAD_REQUEST,
              httpMessages.USER.PROFILE.AGE_RANGE_FAILURE
            );
          }

          userProfile.dateOfBirth = new Date(userProfile.dateOfBirth);
        }

        const profile = await this.userService.updateUserByProfile(
          userId,
          userProfile
        );
        const data = { profile };
        return response.status(httpStatus.CREATED).send({
          success: true,
          message: httpMessages.USER.PROFILE.UPDATE_SUCCESS,
          data
        });
      } catch (error: any) {
        return errorResponse(response, error);
      }
    }
  );

  static updatePassword = catchAsync(
    async (request: any, response: Response) => {
      try {
        const userId = request.user.id;
        const { oldPassword, newPassword } = request.body;

        return this.userService
          .updatePassword(userId, oldPassword, newPassword)
          .then((resp: any) => {
            const data = {};
            return response.status(httpStatus.CREATED).send({
              success: true,
              message: httpMessages.USER.PROFILE.PASSWORD_UPDATE_SUCCESS,
              data
            });
          })
          .catch((error: any) => {
            return errorResponse(response, error);
          });
      } catch (error: any) {
        return errorResponse(response, error);
      }
    }
  );

  static uploadProfilePic = catchAsync(
    async (request: any, response: Response) => {
      try {
        const user = request.user;

        const fileName = `${Math.floor(
          100000 + Math.random() * 900000
        )}${Date.now()}_${user.firstName}`;

        const profilePhoto = await this.awsService.uploadFileInS3(
          fileName,
          request.files?.profileImage
        );

        const userBody = {
          profileImage: profilePhoto
        };

        await this.userService.updateUserById(
          user?.id,
          userBody
        );

        const data = { };
        return response.status(httpStatus.CREATED).send({
          success: true,
          message: httpMessages.USER.PHOTO.SUCCESS,
          data
        });
      } catch (error: any) {
        return errorResponse(response, error);
      }
    }
  );

  static getAddresses = catchAsync(async (request: any, response: Response) => {
    try {
      const userId = request.user.id;
      const addresses = await this.addressService.getAddresses(userId);

      const data = { addresses };
      return response.status(httpStatus.CREATED).send({
        success: true,
        message: httpMessages.USER.ADDRESS.GET_ALL_SUCCESS,
        data
      });
    } catch (error: any) {
      return errorResponse(response, error);
    }
  });

  static getAddressesById = catchAsync(
    async (request: Request, response: Response) => {
      try {
        const addressId: number = parseInt(request.params.addressId, 10);
        const address = await this.addressService.getAddressById(addressId);

        const data = { address };
        return response.status(httpStatus.CREATED).send({
          success: true,
          message: httpMessages.USER.ADDRESS.GET_SUCCESS,
          data
        });
      } catch (error: any) {
        return errorResponse(response, error);
      }
    }
  );

  static saveAddress = catchAsync(async (request: any, response: Response) => {
    try {
      const userId = request.user.id;
      let { isPrimary } = request.body;

      if (isPrimary) {
        await this.addressService.resetPrimaryAddress(userId);
      }

      const addresses = await this.addressService.getAddresses(userId);
      if (addresses?.length === 0) {
        isPrimary = true;
      }

      const addressBody = {
        ...request.body,
        userId,
        isPrimary
      };
      const address = await this.addressService.createAddress(addressBody);
      const data = { address };
      return response.status(httpStatus.CREATED).send({
        success: true,
        message: httpMessages.USER.ADDRESS.ADD_SUCCESS,
        data
      });
    } catch (error: any) {
      return errorResponse(response, error);
    }
  });

  static updateAddress = catchAsync(
    async (request: any, response: Response) => {
      try {
        const { addressId } = request.params;
        const { isPrimary } = request.body;
        const userId = request.user.id;

        if (isPrimary) {
          await this.addressService.resetPrimaryAddress(userId);
        }

        const addressBody = {
          ...request.body,
          userId
        };
        const address = await this.addressService.updateAddress(
          addressId,
          addressBody
        );
        const data = { address };
        return response.status(httpStatus.CREATED).send({
          success: true,
          message: httpMessages.USER.ADDRESS.UPDATE_SUCCESS,
          data
        });
      } catch (error: any) {
        return errorResponse(response, error);
      }
    }
  );

  static deleteAddress = async (request: any, response: Response) => {
    try {
      const { addressId } = request.params;
      await this.addressService.deleteAddress(addressId);
      const data = {};
      return response.status(httpStatus.CREATED).send({
        success: true,
        message: httpMessages.USER.ADDRESS.DELETE_SUCCESS,
        data
      });
    } catch (error: any) {
      return errorResponse(response, error);
    }
  };
}
