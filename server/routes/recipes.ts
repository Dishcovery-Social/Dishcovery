import { Router } from "express";
import * as RecipesController from "../controllers/recipesController.js";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

// GET /recipes
router.get("/", RecipesController.getAllRecipes);
router.get("/:id", RecipesController.getRecipeById);

// POST /recipes
router.post("/", authenticate, RecipesController.createRecipe);

router.patch("/:id", authenticate, RecipesController.patchRecipeById);

export default router;
