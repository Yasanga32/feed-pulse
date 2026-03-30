import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const analyzeFeedback = async (
    title: string,
    description: string
) => {
    try {

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
Analyse this product feedback. Return ONLY valid JSON with these fields:
category, sentiment, priority_score (1-10), summary, tags.

Title: ${title}
Description: ${description}
`;

        const result = await model.generateContent(prompt);

        const response = result.response;

        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) return null;

        return JSON.parse(jsonMatch[0]);

    } catch (error: any) {
        console.error("Gemini error:", error.message);
        return null;
    }
};