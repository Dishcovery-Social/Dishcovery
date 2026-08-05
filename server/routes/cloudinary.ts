import { Router } from "express";
import multer from "multer";
import { deleteFile, upload } from "../controllers/cloudinaryController.js";
import { authenticate } from "../middleware/authenticate.js";

const storage = multer.memoryStorage();
const uploadMiddleWare = multer({ storage });
const router: Router = Router();

router.post("/upload", authenticate, uploadMiddleWare.single("file"), upload);
router.delete("/delete", authenticate, deleteFile);

export default router;
