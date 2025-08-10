// Client-side functions that call our secure API routes
// OpenAI calls are now handled server-side in API routes
// The API key is provided by the user and sent with each request

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

// Validate bingo pattern using our secure API route
export async function validateBingoPattern(
  input: ValidateBingoPatternInput,
  apiKey: string
): Promise<ValidateBingoPatternOutput> {
  const { card, markedSquares } = input;

  try {
    const response = await fetch("/api/validate-bingo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card, markedSquares, apiKey }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return result as ValidateBingoPatternOutput;
  } catch (error) {
    console.error("Error validating bingo pattern:", error);
    // Fallback to simple validation logic
    return { isValidBingo: false };
  }
}

// Consolidate wishes and worries using our secure API route
export async function consolidateWishesAndWorries(
  input: ConsolidateWishesAndWorriesInput,
  apiKey: string
): Promise<ConsolidateWishesAndWorriesOutput> {
  const { wishes, worries } = input;

  try {
    const response = await fetch("/api/consolidate-insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wishes, worries, apiKey }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return result as ConsolidateWishesAndWorriesOutput;
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
