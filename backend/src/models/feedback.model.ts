import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 120
        },

        description: {
            type: String,
            required: true,
            minlength: 20
        },

        category: {
            type: String,
            enum: ["Bug", "Feature Request", "Improvement", "Other"],
            required: true
        },

        status: {
            type: String,
            enum: ["New", "In Review", "Resolved"],
            default: "New"
        },

        submitterName: {
            type: String
        },

        submitterEmail: {
            type: String
        },

        // AI fields
        ai_category: String,

        ai_sentiment: {
            type: String,
            enum: ["Positive", "Neutral", "Negative"]
        },

        ai_priority: {
            type: Number,
            min: 1,
            max: 10
        },

        ai_summary: String,

        ai_tags: [String],

        ai_processed: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);


feedbackSchema.index({ status: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ ai_priority: -1 });
feedbackSchema.index({ createdAt: -1 });

export const Feedback = mongoose.model("Feedback", feedbackSchema);