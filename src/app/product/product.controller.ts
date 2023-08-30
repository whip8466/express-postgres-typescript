import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import errorResponse from "../../utils/response";
import httpMessages from "../../config/httpMessages";

import ProductService from "./product.service";

export default class ProductController {
  static productService = ProductService;

  static getProducts = catchAsync(
    async (request: Request, response: Response) => {
      try {
        const products = await this.productService.getProducts();

        const data = { products };
        return response.status(httpStatus.CREATED).send({
          success: true,
          message: httpMessages.PRODUCT.SUCCESS,
          data
        });
      } catch (error: any) {
        return errorResponse(response, error);
      }
    }
  );

  static getProductsByCategory = catchAsync(
    async (request: Request, response: Response) => {
      try {
        const categoryId: number = parseInt(request.params.categoryId, 10);
        const products = await this.productService.getProductsByCategory(
          categoryId
        );

        const data = { products };
        return response.status(httpStatus.CREATED).send({
          success: true,
          message: httpMessages.PRODUCT.SUCCESS,
          data
        });
      } catch (error: any) {
        return errorResponse(response, error);
      }
    }
  );

  static getProductById = catchAsync(
    async (request: Request, response: Response) => {
      try {
        const productId: number = parseInt(request.params.productId, 10);
        const product = await this.productService.getProductById(productId);

        const data = { product };
        return response.status(httpStatus.CREATED).send({
          success: true,
          message: httpMessages.PRODUCT.DETAILS.SUCCESS,
          data
        });
      } catch (error: any) {
        return errorResponse(response, error);
      }
    }
  );
}
