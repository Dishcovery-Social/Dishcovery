import { Router } from "express";
import * as RecipesController from "../controllers/recipesController.js";

const router: Router = Router();

// GET /recipes
router.get("/", RecipesController.getAllRecipes);
router.get("/:id", RecipesController.getRecipeById);

router.patch("/:id", RecipesController.patchRecipeById);

export default router;
