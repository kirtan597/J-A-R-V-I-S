const OPENROUTER_API_KEY = process.env.GEMINI_API_KEY;
const SITE_URL = "https://jarvis-ai.app";
const SITE_NAME = "JARVIS AI";

if (!OPENROUTER_API_KEY) {
    console.warn("GEMINI_API_KEY is not defined in environment variables (mapped to OpenRouter).");
}

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

export const streamGeminiResponse = async (
    history: { role: "user" | "model"; parts: string }[],
    newMessage: string
) => {
    const messages = [
        { role: "system", content: systemInstruction },
        ...history.map(msg => ({
            role: msg.role === "model" ? "assistant" : "user",
            content: msg.parts
        })),
        { role: "user", content: newMessage }
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": process.env.GEMINI_MODEL || "google/gemini-2.0-flash-001",
            "messages": messages,
            "stream": true,
            "temperature": 0.7,
            "top_p": 0.9,
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API Error: ${response.statusText} - ${errorText}`);
    }

    if (!response.body) {
        throw new Error("OpenRouter API Error: No response body");
    }

    return response.body;
};
