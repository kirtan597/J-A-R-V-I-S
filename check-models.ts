
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    try {
        // For checking models, we don't need a model instance, 
        // but the SDK structure usually assumes we get a model to generate content.
        // However, to LIST models we might need to use the REST API manually 
        // because the JS SDK strictly focuses on generation in many versions.
        // Actually, checking the docs, we can just try to generate with a fallback model 
        // or we can use the model field to strict check.

        // Let's try to just hit the generic one.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test");
        console.log("Gemini 1.5 Flash is WORKING!");
    } catch (e: any) {
        console.log("Gemini 1.5 Flash Failed:", e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test");
        console.log("Gemini Pro is WORKING!");
    } catch (e: any) {
        console.log("Gemini Pro Failed:", e.message);
    }
}

listModels();
