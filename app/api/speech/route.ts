import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice = "coral", instructions, response_format = "wav" } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" | "coral" | "ash" | "ballad" | "cove" | "sage" | "verse",
      input: text,
      ...(instructions && { instructions }),
      response_format: response_format as "mp3" | "opus" | "aac" | "flac" | "wav" | "pcm",
    });

    // Convert the response to a stream
    const stream = response.body as ReadableStream;
    
    // Return the stream with appropriate headers
    return new NextResponse(stream, {
      headers: {
        "Content-Type": `audio/${response_format}`,
        "Content-Disposition": `inline; filename="speech.${response_format}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
