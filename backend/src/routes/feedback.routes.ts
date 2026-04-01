import { Router } from "express";
import { body } from "express-validator";
import { createFeedback, deleteFeedback, getFeedbackById, getFeedbacks, getFeedbackStats, getFeedbackSummary, reAnalyzeFeedback, updateFeedback } from "../controllers/feedback.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { feedbackLimiter } from "../middleware/rateLimit.middleware.js";

const feedbackRouter = Router();

console.log("FeedbackRouter: authMiddleware is:", typeof authMiddleware);

const feedbackValidator = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .escape(),
    body("description")
        .trim()
        .isLength({ min: 20 }).withMessage("Description must be at least 20 characters long")
        .escape(),
    body("category")
        .trim()
        .notEmpty().withMessage("Category is required")
        .escape(),
    body("submitterName").optional().trim().escape(),
    body("submitterEmail").optional().trim().isEmail().withMessage("Invalid email format").escape()
];

feedbackRouter.post("/", feedbackLimiter, feedbackValidator, createFeedback);
feedbackRouter.get("/", authMiddleware, getFeedbacks);

feedbackRouter.get("/summary", authMiddleware, getFeedbackSummary);
feedbackRouter.get("/stats", authMiddleware, getFeedbackStats);

//dynamic routes
feedbackRouter.post("/:id/analyze", authMiddleware, reAnalyzeFeedback);
feedbackRouter.get("/:id", authMiddleware, getFeedbackById);
feedbackRouter.patch("/:id", authMiddleware, updateFeedback);
feedbackRouter.delete("/:id", authMiddleware, deleteFeedback);



export default feedbackRouter;