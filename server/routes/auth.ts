import { Router } from "express";
import * as AuthController from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

// Initiate OAuth with GitHub
router.get("/github", AuthController.initiateGitHubLogin);
// Handle authentication status back from GitHub
router.get("/github/callback", AuthController.handleGitHubCallback);
// Get current user if authenticated
router.get("/me", authenticate, AuthController.getCurrentUser);
// Handle user logout regardless of authentication method
router.post("/logout", authenticate, AuthController.handleLogout);

export default router;
