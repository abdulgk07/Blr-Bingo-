import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit } from "@/lib/rate-limit";
import { env } from "@/lib/env";

// Initialize OpenAI client server-side only
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

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
    const { card, markedSquares } = body;

    if (!card || !markedSquares) {
      return NextResponse.json(
        { error: "Missing required fields: card and markedSquares" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert Bingo validator. You will be given a Bingo card and a pattern of marked squares.
Your job is to determine if the marked squares form a valid Bingo pattern (a full row, column, or diagonal).

Bingo Card (5x5 grid):
${card
  .map((item: string, index: number) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    return col === 0 ? `\nRow ${row + 1}: ${item}` : `, ${item}`;
  })
  .join("")}

Marked Squares (true = marked, false = not marked):
${markedSquares
  .map((marked: boolean, index: number) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    return col === 0 ? `\nRow ${row + 1}: ${marked}` : `, ${marked}`;
  })
  .join("")}

Based on the card and marked squares provided above, determine if the player has a valid bingo.
A valid bingo is a full row, column, or diagonal of marked squares.

Please respond with a JSON object containing:
- isValidBingo: boolean (true if there's a winning pattern)
- winningPattern: string (description of the winning pattern if isValidBingo is true, otherwise omit this field)

Example responses:
{"isValidBingo": true, "winningPattern": "Row 1 (horizontal)"}
{"isValidBingo": true, "winningPattern": "Column 3 (vertical)"}
{"isValidBingo": true, "winningPattern": "Main diagonal (top-left to bottom-right)"}
{"isValidBingo": false}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(responseContent);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error validating bingo pattern:", error);

    // Fallback to simple validation logic
    const { markedSquares } = await request.json();
    const result = simpleValidateBingo(markedSquares);
    return NextResponse.json(result);
  }
}

function simpleValidateBingo(markedSquares: boolean[]) {
  // Check rows
  for (let row = 0; row < 5; row++) {
    if (markedSquares.slice(row * 5, (row + 1) * 5).every(Boolean)) {
      return {
        isValidBingo: true,
        winningPattern: `Row ${row + 1} (horizontal)`,
      };
    }
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    if ([0, 1, 2, 3, 4].every((row) => markedSquares[row * 5 + col])) {
      return {
        isValidBingo: true,
        winningPattern: `Column ${col + 1} (vertical)`,
      };
    }
  }

  // Check main diagonal (top-left to bottom-right)
  if ([0, 6, 12, 18, 24].every((index) => markedSquares[index])) {
    return {
      isValidBingo: true,
      winningPattern: "Main diagonal (top-left to bottom-right)",
    };
  }

  // Check anti-diagonal (top-right to bottom-left)
  if ([4, 8, 12, 16, 20].every((index) => markedSquares[index])) {
    return {
      isValidBingo: true,
      winningPattern: "Anti-diagonal (top-right to bottom-left)",
    };
  }

  return { isValidBingo: false };
}
