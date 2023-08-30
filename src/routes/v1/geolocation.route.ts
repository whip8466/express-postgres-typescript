import express from "express";
import GeolocationController from "../../app/geoLocation/geolocation.controller";

const router = express.Router();
router.get("/countries", GeolocationController.getCountries);
router.get("/states/:countryId", GeolocationController.getStates);
router.get("/cities/:stateId", GeolocationController.getCities);

export default router;
