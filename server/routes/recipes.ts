import { Router } from "express";
import * as RecipesController from "../controllers/recipesController.js";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

// GET /recipes
router.get("/", RecipesController.getAllRecipes);
router.get("/:id", RecipesController.getRecipeById);

router.delete("/:id", authenticate, RecipesController.deleteRecipe);

export default router;
