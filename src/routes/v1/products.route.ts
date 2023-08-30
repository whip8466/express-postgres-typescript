import express from "express";

import ProductController from "../../app/product/product.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();
router.get("/", auth, ProductController.getProducts);
router.get("/:productId", auth, ProductController.getProductById);

export default router;
