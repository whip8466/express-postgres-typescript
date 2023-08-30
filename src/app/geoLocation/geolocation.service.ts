const httpStatus = require("http-status");

const ApiError = require("../../utils/ApiError");
const { default: Country } = require("../../database/models/country.model");
const { default: State } = require("../../database/models/state.model");
const { default: City } = require("../../database/models/city.model");

export default class GeolocationService {
  constructor() {}

  /**
   * Return countries
   * @returns {Promise<Country[]>}
   */
  static getCountries = async () => {
    try {
      return await Country.findAll({});
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  /**
   * Return states
   * @returns {Promise<State[]>}
   */
  static getStatesByCountry = async (countryId: number) => {
    try {
      return await State.findAll({
        where: {
          countryId
        },
        order: [["name", "ASC"]]
      });
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };

  /**
   * Return cities
   * @returns {Promise<City[]>}
   */
  static getCitiesByState = async (stateId: number) => {
    try {
      return await City.findAll({
        where: {
          stateId
        }
      });
    } catch (error: any) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    }
  };
}
