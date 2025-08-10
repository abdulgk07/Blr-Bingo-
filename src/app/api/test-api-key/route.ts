import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Test the API key by making a simple request
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Make a minimal request to test the key
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Hello",
        },
      ],
      max_tokens: 5,
    });

    if (completion.choices[0]?.message?.content) {
      return NextResponse.json({
        success: true,
        message: "API key is valid",
      });
    } else {
      throw new Error("Invalid response from OpenAI");
    }
  } catch (error) {
    console.error("Error testing API key:", error);

    // Return a generic error message for security
    return NextResponse.json(
      { error: "Invalid API key. Please check your key and try again." },
      { status: 401 }
    );
  }
}
