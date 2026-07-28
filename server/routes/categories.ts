import { Router } from "express";
import * as CategoryController from "../controllers/categoriesController.js";

const router: Router = Router();

router.get("/", CategoryController.getAllCategories);

export default router;
