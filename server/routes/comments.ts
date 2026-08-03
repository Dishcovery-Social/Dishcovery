import { Router } from "express";
import * as CommentsController from "../controllers/commentsController.js";

const router: Router = Router({ mergeParams: true });

router.get("/", CommentsController.getAllCommentsForRecipe);

export default router;
