import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "anonymous";
    const { success } = await rateLimit(identifier);

    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { wishes, worries, apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    if (!wishes || !worries) {
      return NextResponse.json(
        { error: "Missing required fields: wishes and worries" },
        { status: 400 }
      );
    }

    const prompt = `You are a qualitative data analyst. You will be given a list of "wishes" and a list of "worries" from a team brainstorming session about AI.
Your task is to identify the recurring themes in each list, count the occurrences of each theme, and provide a concise summary.

Analyze the following wishes:
${wishes.map((wish: string) => `- ${wish}`).join("\n")}

Analyze the following worries:
${worries.map((worry: string) => `- ${worry}`).join("\n")}

Based on your analysis, generate a comma-separated summary for the wishes and another for the worries.
For wishesSummary, list the main positive themes and their counts.
For worriesSummary, list the main negative themes and their counts.
Normalize the themes (e.g., "losing my job" and "job displacement" should both count towards "Job Displacement").

Please respond with a JSON object containing:
- wishesSummary: string (comma-separated themes with counts, e.g., "Personalized Learning (2), Medical Breakthroughs (1)")
- worriesSummary: string (comma-separated themes with counts, e.g., "Job Displacement (3), Privacy (2), AI Bias (1)")

Example response:
{"wishesSummary": "Personalized Learning (2), Medical Breakthroughs (1)", "worriesSummary": "Job Displacement (3), Privacy (2), AI Bias (1)"}`;

    // Initialize OpenAI client with the provided API key
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(responseContent);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error consolidating insights:", error);

    // Fallback to simple consolidation
    const { wishes, worries } = await request.json();
    const result = {
      wishesSummary:
        wishes.length > 0
          ? `Various Wishes (${wishes.length})`
          : "No wishes yet",
      worriesSummary:
        worries.length > 0
          ? `Various Concerns (${worries.length})`
          : "No worries yet",
    };
    return NextResponse.json(result);
  }
}
