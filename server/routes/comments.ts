import { Router } from "express";
import * as CommentsController from "../controllers/commentsController.js";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router({ mergeParams: true });

router.get("/", CommentsController.getAllCommentsForRecipe);
router.post("/", authenticate, CommentsController.createCommentForRecipe);
router.delete(
  "/:commentId",
  authenticate,
  CommentsController.deleteCommentById,
);

export default router;
