import { Request, Response } from "express";
import { Feedback } from "../models/feedback.model.js";


export const createFeedback = async (req: Request, res: Response) => {
    try {
        const { title, description, category, submitterName, submitterEmail } = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({ success: false, message: "Please provide all the required field" })
        }

        if (description.length < 20) {
            return res.status(400).json({ success: false, message: "Description must be at least 20 characters long" })
        }

        //creating feedback in db
        const feedback = await Feedback.create({
            title,
            description,
            category,
            submitterName,
            submitterEmail
        });

        res.status(201).json({
            success: true,
            message: "Feedback created successfully",
            data: feedback
        });


    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
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