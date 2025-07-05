'use server';

/**
 * @fileOverview An AI flow to explore the meaning and origin of a quote.
 *
 * - exploreQuote - A function that handles the quote exploration process.
 * - ExploreQuoteInput - The input type for the exploreQuote function.
 * - ExploreQuoteOutput - The return type for the exploreQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExploreQuoteInputSchema = z.object({
  text: z.string().describe('The text of the quote.'),
  author: z.string().describe('The author of the quote.'),
});
export type ExploreQuoteInput = z.infer<typeof ExploreQuoteInputSchema>;

const ExploreQuoteOutputSchema = z.object({
  meaning: z.string().describe("An explanation of the quote's meaning."),
  origin: z.string().describe('The origin of the quote (when and where it was first used).'),
  trivia: z.string().describe('Interesting trivia or facts related to the quote or its author.'),
  isConfirmed: z.boolean().describe('A boolean indicating if there is strong evidence the quote genuinely originates from the author. Be conservative; only set to true if the attribution is well-documented.'),
});
export type ExploreQuoteOutput = z.infer<typeof ExploreQuoteOutputSchema>;

export async function exploreQuote(input: ExploreQuoteInput): Promise<ExploreQuoteOutput> {
  return exploreQuoteFlow(input);
}

const exploreQuotePrompt = ai.definePrompt({
  name: 'exploreQuotePrompt',
  input: {schema: ExploreQuoteInputSchema},
  output: {schema: ExploreQuoteOutputSchema},
  prompt: `You are a literary and historical expert. Given the following quote and its author, provide a deeper exploration of its meaning, its likely origin (when and where it might have been said or written), and any interesting trivia associated with it.

  Critically, you must also verify the attribution. Determine if there is strong, documented evidence that the author actually said or wrote this quote. Set the 'isConfirmed' field to true only if you have high confidence in the attribution. If the quote is commonly misattributed or its origin is disputed, set 'isConfirmed' to false.

  Quote: "{{{text}}}"
  Author: {{{author}}}

  Please provide the information in the specified JSON format. If you cannot find specific information for a field, provide a thoughtful estimation or state that the information is not widely known.`,
});

const exploreQuoteFlow = ai.defineFlow(
  {
    name: 'exploreQuoteFlow',
    inputSchema: ExploreQuoteInputSchema,
    outputSchema: ExploreQuoteOutputSchema,
  },
  async input => {
    const {output} = await exploreQuotePrompt(input);
    return output!;
  }
);
