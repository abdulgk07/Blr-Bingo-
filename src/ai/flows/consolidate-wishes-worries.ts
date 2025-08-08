'use server';
/**
 * @fileOverview Implements a Genkit flow to consolidate wishes and worries from users.
 *
 * - consolidateWishesAndWorries -  Function to analyze lists of wishes and worries and summarize the main themes.
 * - ConsolidateWishesAndWorriesInput - The input type for the function.
 * - ConsolidateWishesAndWorriesOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConsolidateWishesAndWorriesInputSchema = z.object({
  wishes: z.array(z.string()).describe('A list of sentences describing hopes or wishes about AI.'),
  worries: z.array(z.string()).describe('A list of sentences describing concerns or worries about AI.'),
});
export type ConsolidateWishesAndWorriesInput = z.infer<typeof ConsolidateWishesAndWorriesInputSchema>;

const ConsolidateWishesAndWorriesOutputSchema = z.object({
  wishesSummary: z.string().describe('A comma-separated summary of the main themes from the wishes, including a count for each. e.g., "Personalized Learning (2), Medical Breakthroughs (1)".'),
  worriesSummary: z.string().describe('A comma-separated summary of the main themes from the worries, including a count for each. e.g., "Job Displacement (3), Privacy (2), AI Bias (1)".'),
});
export type ConsolidateWishesAndWorriesOutput = z.infer<typeof ConsolidateWishesAndWorriesOutputSchema>;

export async function consolidateWishesAndWorries(input: ConsolidateWishesAndWorriesInput): Promise<ConsolidateWishesAndWorriesOutput> {
  return consolidateWishesAndWorriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'consolidateWishesWorriesPrompt',
  input: {schema: ConsolidateWishesAndWorriesInputSchema},
  output: {schema: ConsolidateWishesAndWorriesOutputSchema},
  prompt: `You are a qualitative data analyst. You will be given a list of "wishes" and a list of "worries" from a team brainstorming session about AI.
Your task is to identify the recurring themes in each list, count the occurrences of each theme, and provide a concise summary.

Analyze the following wishes:
{{#each wishes}}
- {{this}}
{{/each}}

Analyze the following worries:
{{#each worries}}
- {{this}}
{{/each}}

Based on your analysis, generate a comma-separated summary for the wishes and another for the worries.
For wishesSummary, list the main positive themes and their counts.
For worriesSummary, list the main negative themes and their counts.
Normalize the themes (e.g., "losing my job" and "job displacement" should both count towards "Job Displacement").
Only return the summaries in the specified format.`,
});

const consolidateWishesAndWorriesFlow = ai.defineFlow(
  {
    name: 'consolidateWishesAndWorriesFlow',
    inputSchema: ConsolidateWishesAndWorriesInputSchema,
    outputSchema: ConsolidateWishesAndWorriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
