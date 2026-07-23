import { Router } from "express";
import * as RecipesController from "../controllers/recipesController.js";

const router: Router = Router();

// GET /recipes
router.get("/", RecipesController.getAllRecipes);

export default router;
