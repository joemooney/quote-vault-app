"use server";

import { discoverQuote, type DiscoverQuoteInput } from '@/ai/flows/discover-quote';
import { exploreQuote, type ExploreQuoteInput } from '@/ai/flows/explore-quote';

export async function handleDiscoverQuote(gist: string) {
  try {
    const input: DiscoverQuoteInput = { quoteGist: gist, count: 5 };
    const result = await discoverQuote(input);
    if (result.quotes && result.quotes.length > 0) {
      return { success: true, quotes: result.quotes };
    }
    return { success: false, error: 'Could not find any quotes for the given topic.' };
  } catch (error) {
    console.error("Error discovering quotes:", error);
    const message = error instanceof Error ? error.message : "Please try again.";
    return { success: false, error: `Discovery failed: ${message}` };
  }
}

export async function handleExploreQuote(text: string, author: string) {
  try {
    const input: ExploreQuoteInput = { text, author };
    const result = await exploreQuote(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error exploring quote:", error);
    const message = error instanceof Error ? error.message : "Please try again.";
    return { success: false, error: `Exploration failed: ${message}` };
  }
}
