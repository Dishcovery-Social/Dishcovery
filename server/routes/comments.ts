import { Router } from "express";
import * as CommentsController from "../controllers/commentsController.js";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router({ mergeParams: true });

router.get("/", CommentsController.getAllCommentsForRecipe);

export default router;
