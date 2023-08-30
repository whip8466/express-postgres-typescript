import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import httpMessages from "../../config/httpMessages";
import errorResponse from "../../utils/response";

import CategoryService from "./category.service";
import { getContentLanguage } from "../../utils/util";

export default class CategoryController {
  static categoryService = CategoryService;

  constructor() {}

  static getCategories = catchAsync(
    async (request: Request, response: Response) => {
      try {
        const language: string = getContentLanguage(request);
        const categories = await this.categoryService.getCategories(language);

        const data = { categories };
        return response.status(httpStatus.CREATED).send({
          success: true,
          message: httpMessages.CATEGORY.SUCCESS,
          data
        });
      } catch (error) {
        return errorResponse(response, error);
      }
    }
  );
}
