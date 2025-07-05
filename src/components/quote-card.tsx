import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Quote } from "@/lib/types";

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <Card className="flex h-full flex-col transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <blockquote className="border-l-4 border-primary pl-4 text-lg italic text-foreground/80">
          {quote.text}
        </blockquote>
      </CardHeader>
      <CardContent className="flex-grow">
        <Link href={`?author=${encodeURIComponent(quote.author)}`} legacyBehavior>
          <a className="font-medium text-primary hover:underline">- {quote.author}</a>
        </Link>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {quote.tags.map((tag) => (
          <Link href={`?tag=${encodeURIComponent(tag)}`} key={tag} legacyBehavior>
            <Badge
              variant="secondary"
              className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </CardFooter>
    </Card>
  );
}
