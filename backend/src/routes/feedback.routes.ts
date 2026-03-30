import { Router } from "express";
import { createFeedback } from "../controllers/feedback.controller.js";


const feedbackRouter = Router();

feedbackRouter.post("/", createFeedback);

export default feedbackRouter;