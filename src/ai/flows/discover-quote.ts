'use server';

/**
 * @fileOverview AI flow to discover a quote on the web given a gist.
 *
 * - discoverQuote - A function that searches for a quote on the web.
 * - DiscoverQuoteInput - The input type for the discoverQuote function.
 * - DiscoverQuoteOutput - The return type for the discoverQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscoverQuoteInputSchema = z.object({
  quoteGist: z.string().describe('The gist of the quote to search for.'),
});
export type DiscoverQuoteInput = z.infer<typeof DiscoverQuoteInputSchema>;

const DiscoverQuoteOutputSchema = z.object({
  fullQuote: z.string().describe('The full text of the quote found on the web.'),
});
export type DiscoverQuoteOutput = z.infer<typeof DiscoverQuoteOutputSchema>;

export async function discoverQuote(input: DiscoverQuoteInput): Promise<DiscoverQuoteOutput> {
  return discoverQuoteFlow(input);
}

const discoverQuotePrompt = ai.definePrompt({
  name: 'discoverQuotePrompt',
  input: {schema: DiscoverQuoteInputSchema},
  output: {schema: DiscoverQuoteOutputSchema},
  prompt: `You are an AI assistant that helps users find the full text of a quote given a gist.

  Given the following gist of a quote, search the web and find the complete quote text. Return only the quote text and nothing else.

  Gist: {{{quoteGist}}}`,
});

const discoverQuoteFlow = ai.defineFlow(
  {
    name: 'discoverQuoteFlow',
    inputSchema: DiscoverQuoteInputSchema,
    outputSchema: DiscoverQuoteOutputSchema,
  },
  async input => {
    const {output} = await discoverQuotePrompt(input);
    return output!;
  }
);
