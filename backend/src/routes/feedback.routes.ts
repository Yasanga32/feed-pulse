import { Router } from "express";
import { createFeedback, deleteFeedback, getFeedbackById, getFeedbacks, updateFeedback } from "../controllers/feedback.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const feedbackRouter = Router();

console.log("FeedbackRouter: authMiddleware is:", typeof authMiddleware);

feedbackRouter.post("/", createFeedback);
feedbackRouter.get("/", authMiddleware,getFeedbacks);
feedbackRouter.get("/:id", authMiddleware,getFeedbackById);
feedbackRouter.patch("/:id", authMiddleware, updateFeedback);
feedbackRouter.delete("/:id", authMiddleware, deleteFeedback);

export default feedbackRouter;