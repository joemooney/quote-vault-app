"use server";

import { discoverQuote, type DiscoverQuoteInput } from '@/ai/flows/discover-quote';

export async function handleDiscoverQuote(gist: string) {
  try {
    const input: DiscoverQuoteInput = { quoteGist: gist };
    const result = await discoverQuote(input);
    if (result.fullQuote) {
      return { success: true, quote: result.fullQuote };
    }
    return { success: false, error: 'Could not find a quote for the given gist.' };
  } catch (error) {
    console.error("Error discovering quote:", error);
    return { success: false, error: "Failed to discover quote. Please try again." };
  }
}
