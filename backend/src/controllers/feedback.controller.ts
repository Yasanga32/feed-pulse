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