import express, { type Router } from "express";
import * as RecipesController from "../controllers/recipesController.js";

const router: Router = express.Router();

// GET /recipes
router.get("/", RecipesController.getAllRecipes);

// GET /recipes/:id
//router.get("/:id", RecipesController.getRecipeById);

export default router;
