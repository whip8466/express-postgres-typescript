import express from "express";
import { auth } from "../../middlewares/auth";
import CategoryController from "../../app/category/category.controller";
import ProductController from "../../app/product/product.controller";

const router = express.Router();

router.get("/", CategoryController.getCategories);
router.get("/:categoryId/products", auth, ProductController.getProductsByCategory);

export default router;
