'use server';

/**
 * @fileOverview AI flow to discover quotes on the web given a gist.
 *
 * - discoverQuote - A function that searches for quotes on the web.
 * - DiscoverQuoteInput - The input type for the discoverQuote function.
 * - DiscoverQuoteOutput - The return type for the discoverQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscoverQuoteInputSchema = z.object({
  quoteGist: z.string().describe('The gist of the quote to search for.'),
  count: z.number().optional().default(5).describe('The number of quotes to find.'),
});
export type DiscoverQuoteInput = z.infer<typeof DiscoverQuoteInputSchema>;

const DiscoveredQuoteSchema = z.object({
  text: z.string().describe('The full text of the quote.'),
  author: z.string().describe('The author of the quote.'),
  tags: z.array(z.string()).describe('A list of 1-3 relevant tags for the quote.'),
});
export type DiscoveredQuote = z.infer<typeof DiscoveredQuoteSchema>;

const DiscoverQuoteOutputSchema = z.object({
  quotes: z.array(DiscoveredQuoteSchema).describe('An array of discovered quotes.'),
});
export type DiscoverQuoteOutput = z.infer<typeof DiscoverQuoteOutputSchema>;

export async function discoverQuote(input: DiscoverQuoteInput): Promise<DiscoverQuoteOutput> {
  return discoverQuoteFlow(input);
}

const discoverQuotePrompt = ai.definePrompt({
  name: 'discoverQuotePrompt',
  input: {schema: DiscoverQuoteInputSchema},
  output: {schema: DiscoverQuoteOutputSchema},
  prompt: `You are an AI assistant that helps users find quotes based on a topic or gist.

  Given the following topic, search the web and find up to {{{count}}} relevant quotes. For each quote, provide the full text, the author, and a list of 1 to 3 relevant tags.

  Return the result as a JSON object with a single key "quotes" which is an array of quote objects.

  Topic: {{{quoteGist}}}`,
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
