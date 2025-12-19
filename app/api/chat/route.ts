import { streamGeminiResponse } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { history, message } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            console.error("API Key missing");
            return NextResponse.json(
                { error: "Configuration Error: API Key is not set." },
                { status: 500 }
            );
        }

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        try {
            const stream = await streamGeminiResponse(history || [], message);

            const encoder = new TextEncoder();
            const readable = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of stream) {
                            const text = chunk.text();
                            controller.enqueue(encoder.encode(text));
                        }
                        controller.close();
                    } catch (error) {
                        console.error("Streaming error:", error);
                        controller.error(error);
                    }
                },
            });

            return new NextResponse(readable, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                },
            });
        } catch (genAIError: any) {
            console.error("provider Error:", genAIError);
            return NextResponse.json(
                { error: `AI Engine Error: ${genAIError.message || "Unknown error"}` },
                { status: 503 }
            );
        }

    } catch (error) {
        console.error("General API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
