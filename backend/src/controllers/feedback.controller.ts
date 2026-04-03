import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Feedback } from "../models/feedback.model.js";
import { geminiService } from "../services/gemini.service.js";

export const createFeedback = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                data: null,
                error: errors.array(),
                message: errors.array()[0].msg
            });
        }

        const { title, description, category, submitterName, submitterEmail } = req.body;

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
            const analysis = await geminiService.analyzeFeedback(title, description);

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
                    { returnDocument: "after" }
                );

                return res.status(201).json({
                    success: true,
                    data: updated,
                    error: null,
                    message: "Feedback created successfully"
                });
            }

        } catch (aiError: any) {
            console.error("AI analysis failed:", aiError.message);
        }

        // Fallback: return basic feedback if AI failed
        return res.status(201).json({
            success: true,
            data: feedback,
            error: null,
            message: "Feedback created successfully (AI analysis pending or failed)"
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: error.name || "Internal Server Error",
            message: error.message
        });
    }
}

export const getFeedbacks = async (req: Request, res: Response) => {
    try {

        const { category, status, page = 1, limit = 10, sort, search } = req.query;

        // Filtering
        const filter: any = {};

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        // Simple Search
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { ai_summary: { $regex: search, $options: "i" } }
            ];
        }

        // Sorting
        let sortOption: any = { createdAt: -1 };

        if (sort === "priority") {
            sortOption = { ai_priority: -1 };
        }

        if (sort === "date") {
            sortOption = { createdAt: -1 };
        }

        if (sort === "sentiment") {
            sortOption = { ai_sentiment: 1 }; // Typically sorts "Negative" < "Neutral" < "Positive" or similar.
        }

        // Pagination
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const [feedbacks, totalItems] = await Promise.all([
            Feedback.find(filter)
                .sort(sortOption)
                .skip((pageNumber - 1) * limitNumber)
                .limit(limitNumber),
            Feedback.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(totalItems / limitNumber);

        return res.status(200).json({
            success: true,
            data: {
                feedbacks,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: pageNumber
                }
            },
            error: null,
            message: "Feedbacks fetched successfully"
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: error.name || "Internal Server Error",
            message: error.message
        });
    }
}



export const getFeedbackStats = async (req: Request, res: Response) => {
    try {
        const total = await Feedback.countDocuments();

        const open = await Feedback.countDocuments({
            status: "New"
        });

        const avgPriority = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    avg: { $avg: "$ai_priority" }
                }
            }
        ]);

        const topTags = await Feedback.aggregate([
            { $unwind: "$ai_tags" },
            {
                $group: {
                    _id: "$ai_tags",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        return res.json({
            success: true,
            data: {
                total,
                open,
                average_priority: avgPriority[0]?.avg || 0,
                most_common_tag: topTags[0]?._id || null
            },
            error: null,
            message: "Stats fetched successfully"
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: error.name || "Internal Server Error",
            message: "Failed to fetch stats"
        });
    }
};


export const getFeedbackById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "Not Found",
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: feedback,
            error: null,
            message: "Feedback fetched successfully"
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: error.name || "Internal Server Error",
            message: error.message
        });
    }
}

export const updateFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndUpdate(id, req.body, { new: true });

        if (!feedback) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "Not Found",
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: feedback,
            error: null,
            message: "Feedback updated successfully"
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: error.name || "Internal Server Error",
            message: error.message
        });
    }
}

export const reAnalyzeFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "Not Found",
                message: "Feedback not found"
            });
        }

        // Re-call Gemini
        const analysis = await geminiService.analyzeFeedback(feedback.title, feedback.description);

        if (!analysis) {
            return res.status(500).json({
                success: false,
                data: null,
                error: "AI Error",
                message: "AI analysis failed. Please try again."
            });
        }

        // Update with new results
        const updated = await Feedback.findByIdAndUpdate(
            id,
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

        return res.status(200).json({
            success: true,
            data: updated,
            error: null,
            message: "AI Analysis re-triggered successfully"
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: error.name || "Internal Server Error",
            message: error.message
        });
    }
}

export const deleteFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "Not Found",
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: feedback,
            error: null,
            message: "Feedback deleted successfully"
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: error.name || "Internal Server Error",
            message: error.message
        });
    }
}

export const getFeedbackSummary = async (req: Request, res: Response) => {
    try {
        // last 7 days date
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        // get feedback from last 7 days
        const feedback = await Feedback.find({
            createdAt: { $gte: lastWeek }
        });

        if (!feedback.length) {
            return res.status(200).json({
                success: true,
                data: "No feedback in last 7 days",
                error: null,
                message: "No entries found for summary"
            });
        }

        // combine all feedback
        const combinedText = feedback
            .map(f => `Title: ${f.title}\nDescription: ${f.description}`)
            .join("\n\n");

        // send to gemini
        const summary = await geminiService.analyzeSummary(combinedText);

        return res.status(200).json({
            success: true,
            data: summary,
            error: null,
            message: "Summary generated successfully"
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            data: null,
            error: error.name || "Internal Server Error",
            message: "Error generating summary"
        });
    }
};