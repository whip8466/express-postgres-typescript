import httpStatus from "http-status";

import ApiError from "../../utils/ApiError";
import Category from "../../database/models/category.model";
import {
  COMMON_ATTRIBUTES_ALONG_WITH_ID,
  LANGUAGES
} from "../../config/constants";

export default class CategoryService {
  constructor() {}

  /**
   * Return categories
   * @param {string} language
   * @returns {Promise<Category[]>}
   */
  static getCategories = async (language: string): Promise<Category[]> => {
    try {
      let attributes: any = [
        ["categoryNameEN", "categoryName"],
        ...COMMON_ATTRIBUTES_ALONG_WITH_ID
      ];
      if (language === LANGUAGES.ES) {
        attributes = [
          ["categoryNameES", "categoryName"],
          ...COMMON_ATTRIBUTES_ALONG_WITH_ID
        ];
      }

      const categories = await Category.findAll({ attributes });

      return categories;
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  /**
   * Return category
   * @returns {Promise<Category>}
   */
  static getCategoryById = async (
    categoryId: number
  ): Promise<Category | null> => {
    try {
      return await Category.findByPk(categoryId);
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };
}
