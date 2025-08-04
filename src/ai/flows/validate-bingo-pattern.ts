'use server';
/**
 * @fileOverview Implements a Genkit flow to validate a potential winning bingo pattern.
 *
 * - validateBingoPattern -  Function to validate if a given bingo pattern is a winning pattern.
 * - ValidateBingoPatternInput - The input type for the validateBingoPattern function.
 * - ValidateBingoPatternOutput - The output type for the validateBingoPattern function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateBingoPatternInputSchema = z.object({
  card: z.array(z.string()).length(25).describe('The Bingo card entries.'),
  markedSquares: z.array(z.boolean()).length(25).describe('Boolean array indicating marked squares on the card.'),
});
export type ValidateBingoPatternInput = z.infer<typeof ValidateBingoPatternInputSchema>;

const ValidateBingoPatternOutputSchema = z.object({
  isValidBingo: z.boolean().describe('Whether the marked pattern is a valid bingo (row, column, or diagonal).'),
  winningPattern: z.string().optional().describe('Description of the winning pattern, if any.'),
});
export type ValidateBingoPatternOutput = z.infer<typeof ValidateBingoPatternOutputSchema>;

export async function validateBingoPattern(input: ValidateBingoPatternInput): Promise<ValidateBingoPatternOutput> {
  return validateBingoPatternFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateBingoPatternPrompt',
  input: {schema: ValidateBingoPatternInputSchema},
  output: {schema: ValidateBingoPatternOutputSchema},
  prompt: `You are an expert Bingo validator. You will be given a Bingo card and a pattern of marked squares.
Your job is to determine if the marked squares form a valid Bingo pattern (a full row, column, or diagonal).

Bingo Card:
{{#each card}}
  {{this}}{{#unless @last}}, {{/unless}}
{{/each}}

Marked Squares (true = marked, false = not marked):
{{#each markedSquares}}
  {{this}}{{#unless @last}}, {{/unless}}
{{/each}}

Based on the card and marked squares provided above, determine if the player has a valid bingo.
Set isValidBingo to true if there's a full row, column, or diagonal of marked squares. If isValidBingo is true, explain which row, column, or diagonal won.
If there is no winning pattern, isValidBingo should be false, and winningPattern should be null.
`,
});

const validateBingoPatternFlow = ai.defineFlow(
  {
    name: 'validateBingoPatternFlow',
    inputSchema: ValidateBingoPatternInputSchema,
    outputSchema: ValidateBingoPatternOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
