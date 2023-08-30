import httpStatus from "http-status";
const Sequelize = require("sequelize");
import _ from 'lodash';

import {
  COMMON_ATTRIBUTES,
  COMMON_ATTRIBUTES_ALONG_WITH_ID
} from "../../config/constants";
import ApiError from "../../utils/ApiError";

import Product from "../../database/models/product.model";

export default class ProductService {
  constructor() {}

  /**
   * Return products
   * @returns {Promise<Product[]>}
   */
  static getProducts = async (options = {}) => {
    try {
      const { whereOptions = {} }: any = options;

      let productOptions: any = {
        where: whereOptions
      };

      const products = Product.findAll(productOptions);

      return products;
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  /**
   * Return products
   * @returns {Promise<Product[]>}
   */
  static getProductsByCategory = async (categoryId: number) => {
    try {
      const products = this.getProducts({
        whereOptions: {
          categoryId
        }
      });

      return products;
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  /**
   * Return product
   * @returns {Promise<Product>}
   */
  static getProductById = async (productId: number) => {
    try {
      return Product.findByPk(productId);
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  /**
   * Return product
   * @returns {Promise<Product>}
   */
  static getProductByName = async (productName: string) => {
    try {
      const products = await this.getProducts({
        whereOptions: {
          productName
        }
      });

      return products?.[0] || {};
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

}
