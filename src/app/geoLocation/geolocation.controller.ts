import { Request, Response } from "express";
import httpStatus from "http-status";

import errorResponse from "../../utils/response";
import catchAsync from "../../utils/catchAsync";
import httpMessages from "../../config/httpMessages";

import GeolocationService from "./geolocation.service";


export default class GeolocationController {
  static geolocationService = GeolocationService;

  constructor() {}

  static getCountries = catchAsync(async (request: Request, response: Response) => {
    try {
      const countries = await this.geolocationService.getCountries();

      const data = { countries };
      return response.status(httpStatus.CREATED).send({
        success: true,
        message: httpMessages.GEOLOCATION.COUNTRY.SUCCESS,
        data
      });
    } catch (error) {
      return errorResponse(response, error);
    }
  });

  static getStates = catchAsync(async (request: Request, response: Response) => {
    try {
      const countryId = parseInt(request.params.countryId, 10);
      const states = await this.geolocationService.getStatesByCountry(countryId);

      const data = { states };
      return response.status(httpStatus.CREATED).send({
        success: true,
        message: httpMessages.GEOLOCATION.STATE.SUCCESS,
        data
      });
    } catch (error) {
      return errorResponse(response, error);
    }
  });

  static getCities = catchAsync(async (request: Request, response: Response) => {
    try {
      const stateId = parseInt(request.params.stateId, 10);
      const cities = await this.geolocationService.getCitiesByState(stateId);

      const data = { cities };
      return response.status(httpStatus.CREATED).send({
        success: true,
        message: httpMessages.GEOLOCATION.CITY.SUCCESS,
        data
      });
    } catch (error) {
      return errorResponse(response, error);
    }
  });
}
