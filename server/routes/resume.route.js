import express from "express";
import { upload } from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";
import { analyzeResumeATS } from "../controllers/resume.controller.js";

const resumeRouter = express.Router();

resumeRouter.post("/analyze", isAuth, upload.single("resume"), analyzeResumeATS);

export default resumeRouter;