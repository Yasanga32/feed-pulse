import { Request, Response } from "express";
import { Feedback } from "../models/feedback.model.js";
import { analyzeFeedback } from "../services/gemini.service.js";

export const createFeedback = async (req: Request, res: Response) => {
    try {
        const { title, description, category, submitterName, submitterEmail } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required field"
            });
        }

        if (description.length < 20) {
            return res.status(400).json({
                success: false,
                message: "Description must be at least 20 characters long"
            });
        }

        // creating feedback in db
        const feedback = await Feedback.create({
            title,
            description,
            category,
            submitterName,
            submitterEmail
        });

        // Run AI analysis BEFORE sending response
        try {
            const analysis = await analyzeFeedback(title, description);

            if (analysis) {
                const updated = await Feedback.findByIdAndUpdate(
                    feedback._id,
                    {
                        ai_category: analysis.category,
                        ai_sentiment: analysis.sentiment,
                        ai_priority: analysis.priority_score,
                        ai_summary: analysis.summary,
                        ai_tags: analysis.tags,
                        ai_processed: true
                    },
                    { new: true }
                );

                return res.status(201).json({
                    success: true,
                    message: "Feedback created successfully",
                    data: updated
                });
            }

        } catch (aiError: any) {
            console.error("AI analysis failed:", aiError.message);
        }

        // Fallback: return basic feedback if AI failed
        res.status(201).json({
            success: true,
            message: "Feedback created successfully",
            data: feedback
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getFeedbacks = async (req: Request, res: Response) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json({
            success: true,
            message: "Feedbacks fetched successfully",
            data: feedbacks
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export const getFeedbackById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback fetched successfully",
            data: feedback
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const updateFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndUpdate(id, req.body, { new: true });

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback updated successfully",
            data: feedback
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully",
            data: feedback
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}