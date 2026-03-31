import { Request, Response } from "express";
import { Feedback } from "../models/feedback.model.js";
import { analyzeFeedback, analyzeSummary } from "../services/gemini.service.js";

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
                    { returnDocument: "after" }
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
        if (search){
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

        // Pagination
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const feedbacks = await Feedback.find(filter)
            .sort(sortOption)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            success: true,
            message: "Feedbacks fetched successfully",
            data: feedbacks
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const getFeedbackStats = async (req:Request, res:Response) => {
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

    res.json({
      success: true,
      data: {
        total,
        open,
        average_priority: avgPriority[0]?.avg || 0,
        most_common_tag: topTags[0]?._id || null
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
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
    console.log("DELETE CONTROLLER HIT");
    try {
        const { id } = req.params;
        console.log("Delete Feedback Controller triggered for ID:", id);
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
        data: "No feedback in last 7 days"
      });
    }

    // combine all feedback
    const combinedText = feedback
      .map(f => `Title: ${f.title}\nDescription: ${f.description}`)
      .join("\n\n");

    // send to gemini
    const summary = await analyzeSummary(combinedText);

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating summary"
    });
  }
};