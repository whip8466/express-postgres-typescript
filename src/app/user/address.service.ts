import httpStatus from "http-status";

import ApiError from "../../utils/ApiError";
import httpMessages from "../../config/httpMessages";

import Address from "../../database/models/address.model";
import Country from "../../database/models/country.model";
import { COMMON_ATTRIBUTES } from "../../config/constants";
import State from "../../database/models/state.model";
import City from "../../database/models/city.model";

export default class AddressService {
  constructor() {}

  /**
   * Create Address
   * @param {Object} addressBody
   * @returns {Promise<Address>}
   */
  static createAddress = async (addressBody: any) => {
    try {
      return await Address.create(addressBody);
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  /**
   * Return addresses
   * @returns {Promise<Address[]>}
   */
  static getAddresses = async (userId: number) => {
    try {
      return Address.findAll({
        where: { userId }
      });
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  /**
   * Get address by id
   * @param {Number} id
   * @returns {Promise<Address>}
   */
  static getAddressById = async (id: number) => {
    return Address.findOne({
      where: { id },
      include: [
        {
          model: Country,
          attributes: { exclude: COMMON_ATTRIBUTES }
        },
        {
          model: State,
          attributes: { exclude: COMMON_ATTRIBUTES }
        },
        {
          model: City,
          attributes: { exclude: COMMON_ATTRIBUTES }
        }
      ]
    });
  };

  /**
   * Update address by id
   * @param {Number} addressId
   * @param {Object} updateBody
   * @returns {Promise<Address>}
   */
  static updateAddress = async (addressId: number, updateBody: any) => {
    const address = await this.getAddressById(addressId);
    if (!address) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        httpMessages.USER.ADDRESS.NOT_FOUND
      );
    }

    Object.assign(address, updateBody);
    await address.save();
    return address;
  };

  /**
   * Update addresses
   * @param {Object} updateFields
   * @param {Object} whereOptions
   * @returns {Promise<Address>}
   */
  static updateMultipleAddress = async (
    updateFields: any,
    whereOptions: any
  ) => {
    const address = await Address.update(updateFields, { where: whereOptions });
    return address;
  };

  /**
   * Reset addresses
   * @param {number} userId
   * @returns {Promise<Address>}
   */
  static resetPrimaryAddress = async (userId: number) => {
    return await this.updateMultipleAddress({ isPrimary: false }, { userId });
  };

  /**
   * Delete address by id
   * @param {Number} addressId
   * @returns {Promise<Boolean>}
   */
  static deleteAddress = async (addressId: number) => {
    try {
      const deleted = await Address.destroy({
        where: { id: addressId }
      });
      if (!deleted) {
        throw new Error(httpMessages.USER.ADDRESS.NOT_FOUND);
      }

      return deleted;
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };
}
