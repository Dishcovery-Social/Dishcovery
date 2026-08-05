import { Router } from "express";
import multer from "multer";
import { deleteFile, upload } from "../controllers/cloudinaryController.js";

const storage = multer.memoryStorage();
const uploadMiddleWare = multer({ storage });
const router: Router = Router();

router.post("/upload", uploadMiddleWare.single("file"), upload);
router.delete("/delete", deleteFile);

export default router;
