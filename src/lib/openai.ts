// OpenAI integration to replace Genkit
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types for validation
export interface ValidateBingoPatternInput {
  card: string[];
  markedSquares: boolean[];
}

export interface ValidateBingoPatternOutput {
  isValidBingo: boolean;
  winningPattern?: string;
}

export interface ConsolidateWishesAndWorriesInput {
  wishes: string[];
  worries: string[];
}

export interface ConsolidateWishesAndWorriesOutput {
  wishesSummary: string;
  worriesSummary: string;
}

// Validate bingo pattern using OpenAI
export async function validateBingoPattern(
  input: ValidateBingoPatternInput
): Promise<ValidateBingoPatternOutput> {
  const { card, markedSquares } = input;

  const prompt = `You are an expert Bingo validator. You will be given a Bingo card and a pattern of marked squares.
Your job is to determine if the marked squares form a valid Bingo pattern (a full row, column, or diagonal).

Bingo Card (5x5 grid):
${card
  .map((item, index) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    return col === 0 ? `\nRow ${row + 1}: ${item}` : `, ${item}`;
  })
  .join("")}

Marked Squares (true = marked, false = not marked):
${markedSquares
  .map((marked, index) => {
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

  try {
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

    const result = JSON.parse(responseContent) as ValidateBingoPatternOutput;
    return result;
  } catch (error) {
    console.error("Error validating bingo pattern:", error);
    // Fallback to simple validation logic
    return simpleValidateBingo(markedSquares);
  }
}

// Consolidate wishes and worries using OpenAI
export async function consolidateWishesAndWorries(
  input: ConsolidateWishesAndWorriesInput
): Promise<ConsolidateWishesAndWorriesOutput> {
  const { wishes, worries } = input;

  const prompt = `You are a qualitative data analyst. You will be given a list of "wishes" and a list of "worries" from a team brainstorming session about AI.
Your task is to identify the recurring themes in each list, count the occurrences of each theme, and provide a concise summary.

Analyze the following wishes:
${wishes.map((wish) => `- ${wish}`).join("\n")}

Analyze the following worries:
${worries.map((worry) => `- ${worry}`).join("\n")}

Based on your analysis, generate a comma-separated summary for the wishes and another for the worries.
For wishesSummary, list the main positive themes and their counts.
For worriesSummary, list the main negative themes and their counts.
Normalize the themes (e.g., "losing my job" and "job displacement" should both count towards "Job Displacement").

Please respond with a JSON object containing:
- wishesSummary: string (comma-separated themes with counts, e.g., "Personalized Learning (2), Medical Breakthroughs (1)")
- worriesSummary: string (comma-separated themes with counts, e.g., "Job Displacement (3), Privacy (2), AI Bias (1)")

Example response:
{"wishesSummary": "Personalized Learning (2), Medical Breakthroughs (1)", "worriesSummary": "Job Displacement (3), Privacy (2), AI Bias (1)"}`;

  try {
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

    const result = JSON.parse(
      responseContent
    ) as ConsolidateWishesAndWorriesOutput;
    return result;
  } catch (error) {
    console.error("Error consolidating wishes and worries:", error);
    // Fallback to simple consolidation
    return {
      wishesSummary:
        wishes.length > 0
          ? `Various Wishes (${wishes.length})`
          : "No wishes yet",
      worriesSummary:
        worries.length > 0
          ? `Various Concerns (${worries.length})`
          : "No worries yet",
    };
  }
}

// Simple fallback bingo validation (local logic)
function simpleValidateBingo(
  markedSquares: boolean[]
): ValidateBingoPatternOutput {
  // Check rows
  for (let row = 0; row < 5; row++) {
    const start = row * 5;
    if (markedSquares.slice(start, start + 5).every((marked) => marked)) {
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
