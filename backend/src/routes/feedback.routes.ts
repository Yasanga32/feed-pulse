import { Router } from "express";
import { createFeedback, deleteFeedback, getFeedbackById, getFeedbacks, updateFeedback } from "../controllers/feedback.controller.js";


const feedbackRouter = Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.get("/", getFeedbacks);
feedbackRouter.get("/:id", getFeedbackById);
feedbackRouter.patch("/:id", updateFeedback);
feedbackRouter.delete("/:id", deleteFeedback);

export default feedbackRouter;