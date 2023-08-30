import express from "express";

import { validate } from "../../middlewares/middleware";
import { auth } from "../../middlewares/auth";
import { profileUpdate } from "../../validations/user.validation";
import UserController from "../../app/user/user.controller";

const router = express.Router();
router.get("/all", auth, UserController.getUsers);
router.get("/profile", auth, UserController.getProfile);
router.put(
  "/profile",
  auth,
  validate(profileUpdate),
  UserController.updateProfile
);
router.post("/profile/update-password", auth, UserController.updatePassword);
router.post("/profile/pic", auth, UserController.uploadProfilePic);

/**
 * ADDRESS
 * **/
router.get("/profile/address", auth, UserController.getAddresses);
router.get(
  "/profile/address/:addressId",
  auth,
  UserController.getAddressesById
);
router.post("/profile/address", auth, UserController.saveAddress);
router.put("/profile/address/:addressId", auth, UserController.updateAddress);
router.delete(
  "/profile/address/:addressId",
  auth,
  UserController.deleteAddress
);

export default router;
