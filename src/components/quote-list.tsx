import type { Quote } from "@/lib/types";
import QuoteCard from "./quote-card";

interface QuoteListProps {
  quotes: Quote[];
}

export default function QuoteList({ quotes }: QuoteListProps) {
  if (quotes.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
        <p className="text-muted-foreground">No quotes found. Try a different search or filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quotes.map((quote) => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  );
}
