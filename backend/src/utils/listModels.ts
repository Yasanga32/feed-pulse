import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

const listModels = async () => {
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );

        const data = await res.json();

        console.log("🔥 Available Models:\n");

        data.models.forEach((model: any) => {
            console.log(model.name);
        });

    } catch (error) {
        console.error("❌ Error:", error);
    }
};

listModels();