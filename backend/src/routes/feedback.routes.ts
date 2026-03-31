import { Router } from "express";
import { createFeedback, deleteFeedback, getFeedbackById, getFeedbacks, getFeedbackSummary, updateFeedback } from "../controllers/feedback.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { feedbackLimiter } from "../middleware/rateLimit.middleware.js";

const feedbackRouter = Router();

console.log("FeedbackRouter: authMiddleware is:", typeof authMiddleware);

feedbackRouter.post("/", feedbackLimiter ,createFeedback);
feedbackRouter.get("/", getFeedbacks);

feedbackRouter.get("/summary", getFeedbackSummary);

//dynamic routes
feedbackRouter.get("/:id", getFeedbackById);
feedbackRouter.patch("/:id", updateFeedback);
feedbackRouter.delete("/:id", deleteFeedback);



export default feedbackRouter;