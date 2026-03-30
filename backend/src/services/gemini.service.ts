import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const analyzeFeedback = async (title: string, description: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
    Analyse this product feedback and return JSON only:
    
    Title: ${title}
    Description: ${description}
    
    Return format:
    {
      "category": "",
      "sentiment": "",
      "priority_score": "",
      "summary": "",
      "tags": []
    }
    `;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return JSON.parse(response);

    } catch (error: any) {
        console.log("Gemini error:", error.message);
        return null;
    }
};