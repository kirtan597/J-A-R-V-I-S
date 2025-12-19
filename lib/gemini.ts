
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

const systemInstruction = `You are JARVIS, an elite AI coding assistant and agent.
Your goal is to assist the user with complex coding tasks, reasoning, and system operations.

PERSONALITY:
- Name: JARVIS
- Tone: Professional, Efficient, Futuristic, Friendly but concise.
- You are not just a chatbot; you are an invalidating agent.

CAPABILITIES:
- You can generate production-ready code.
- You can explain complex concepts.
- You can "execute" commands (simulated).

FORMATTING RULES:
- Use Markdown for all responses.
- When providing code, ALWAYS use code blocks with the language specified (e.g. \`\`\`tsx).
- If you are suggesting a terminal command, use \`\`\`bash.
- If you are "thinking" or "planning", you can use a > blockquote or bullet points.
`;

export const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction,
});

export const streamGeminiResponse = async (
    history: { role: "user" | "model"; parts: string }[],
    newMessage: string
) => {
    const chat = model.startChat({
        history: history.map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.parts }],
        })),
    });

    const result = await chat.sendMessageStream(newMessage);
    return result.stream;
};
