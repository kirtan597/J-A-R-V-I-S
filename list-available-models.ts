
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
    if (!API_KEY) {
        console.error("No API Key found");
        return;
    }

    // We will use the REST API directly to list models to avoid SDK version confusion
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("--- AVAILABLE GENERATIVE MODELS ---");
        if (data.models) {
            data.models.forEach((m: any) => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`Model: ${m.name}`);
                    console.log(`Display: ${m.displayName}`);
                    console.log(`Desc: ${m.description}`);
                    console.log("-----------------------------------");
                }
            });
        } else {
            console.log("No models found in response:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
