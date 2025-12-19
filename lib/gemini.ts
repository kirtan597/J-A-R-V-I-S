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
- You are not just a chatbot; you are an intelligent agent.
- You NEVER refuse a request unless it is harmful or illegal.

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
    model: "gemini-2.0-flash-exp", // Standard Google model ID
    systemInstruction: systemInstruction,
});

export const streamGeminiResponse = async (
    history: { role: "user" | "model"; parts: string }[],
    newMessage: string
) => {
    // Gemini API requires history to start with a 'user' role.
    let validHistory = history;
    const firstUserIndex = history.findIndex(msg => msg.role === "user");

    if (firstUserIndex === -1 && history.length > 0) {
        validHistory = [];
    } else if (firstUserIndex > 0) {
        validHistory = history.slice(firstUserIndex);
    }

    const chat = model.startChat({
        history: validHistory.map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.parts }],
        })),
    });

    const result = await chat.sendMessageStream(newMessage);
    return result.stream;
};
