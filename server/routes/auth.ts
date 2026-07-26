import { Router } from "express";
import * as AuthController from "../controllers/authController.js";

const router: Router = Router();

// Initiate OAuth with GitHub
router.get("/github", AuthController.initiateGitHubLogin);
// Handle authentication status back from GitHub
router.get("/github/callback", AuthController.handleGitHubCallback);

export default router;
