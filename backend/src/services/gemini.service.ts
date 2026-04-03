import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

export const extractJSON = (text: string) => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
};

// Analyze Single Feedback
export const analyzeFeedback = async (
    title: string,
    description: string
) => {
    try {

        const prompt = `
Analyse this product feedback. Return ONLY valid JSON with these fields:
category, sentiment, priority_score (1-10), summary, tags.

Title: ${title}
Description: ${description}
`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return extractJSON(text);

    } catch (error: any) {
        console.error("Gemini error:", error.message);
        return null;
    }
};


// Analyze Weekly Summary
export const analyzeSummary = async (text: string) => {
    try {

        const prompt = `Analyse these feedback entries and return: Top 3 themes from last 7 days. Return ONLY JSON format:
                {
                    "summary": "",
                    "top_themes": []
                }

                    Feedback:
                ${text}
                `;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);

        if (!jsonMatch) return null;

        return JSON.parse(jsonMatch[0]);

    } catch (error) {
        console.error("Summary error:", error);
        return null;
    }
};

export const geminiService = {
    analyzeFeedback,
    analyzeSummary
};