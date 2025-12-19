const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables.");
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
    // Map 'model' role to 'assistant' for OpenRouter/OpenAI format
    const messages = history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.parts
    }));

    // Add system message
    messages.unshift({ role: 'system', content: systemInstruction });

    // Add new message
    messages.push({ role: 'user', content: newMessage });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://jarvis-ai.app", // Optional, for OpenRouter rankings
            "X-Title": "JARVIS AI", // Optional
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
        const error = await response.text();
        throw new Error(`OpenRouter API Error: ${response.statusText} - ${error}`);
    }

    if (!response.body) {
        throw new Error("No response body received from OpenRouter");
    }

    return response.body;
};
