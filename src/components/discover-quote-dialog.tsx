"use client";

import { useState } from "react";
import { Wand2, Loader2, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { handleDiscoverQuote } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import type { DiscoveredQuote } from "@/ai/flows/discover-quote";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";

interface DiscoverQuoteDialogProps {
  onQuotesAdd: (quotes: DiscoveredQuote[]) => void;
}

export default function DiscoverQuoteDialog({ onQuotesAdd }: DiscoverQuoteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gist, setGist] = useState("");
  const [discoveredQuotes, setDiscoveredQuotes] = useState<DiscoveredQuote[]>([]);
  const [selectedQuoteIndices, setSelectedQuoteIndices] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const resetState = () => {
    setIsLoading(false);
    setGist("");
    setDiscoveredQuotes([]);
    setSelectedQuoteIndices(new Set());
  };

  const handleDiscover = async () => {
    if (!gist.trim()) return;
    setIsLoading(true);
    setDiscoveredQuotes([]);
    setSelectedQuoteIndices(new Set());
    const result = await handleDiscoverQuote(gist);
    setIsLoading(false);
    if (result.success && result.quotes) {
      setDiscoveredQuotes(result.quotes);
      const allIndices = new Set(result.quotes.map((_, index) => index));
      setSelectedQuoteIndices(allIndices);
    } else {
      toast({
        variant: "destructive",
        title: "Discovery Failed",
        description: result.error,
      });
    }
  };

  const handleToggleQuoteSelection = (index: number) => {
    const newSelection = new Set(selectedQuoteIndices);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedQuoteIndices(newSelection);
  };

  const handleAddSelectedQuotes = () => {
    if (selectedQuoteIndices.size === 0) {
       toast({
        variant: "destructive",
        title: "No Quotes Selected",
        description: "Please select at least one quote to add.",
      });
      return;
    }
    
    const quotesToAdd = Array.from(selectedQuoteIndices)
      .map(index => discoveredQuotes[index])
      .filter(Boolean);

    onQuotesAdd(quotesToAdd);

    toast({
      title: "Quotes Added!",
      description: `${quotesToAdd.length} new quote(s) have been added to your vault.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setTimeout(resetState, 300);
      }
    }}>
      <DialogTrigger asChild>
        <Button>
          <Wand2 className="mr-2" />
          Discover Quotes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Discover New Quotes</DialogTitle>
          <DialogDescription>
            Enter a topic or part of a quote, and we'll use AI to find relevant quotes for you.
          </DialogDescription>
        </DialogHeader>
        
        {discoveredQuotes.length === 0 ? (
          <div className="grid gap-4 py-4">
            <Textarea
              id="gist"
              placeholder="e.g., philosophy of stoicism or quotes about creativity"
              value={gist}
              onChange={(e) => setGist(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
            <Button onClick={handleDiscover} disabled={isLoading || !gist.trim()}>
              {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Wand2 className="mr-2" />}
              {isLoading ? "Discovering..." : "Discover"}
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Discovered Quotes ({selectedQuoteIndices.size} selected):</h3>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {discoveredQuotes.map((quote, index) => (
                  <Card key={index} className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/50">
                    <Checkbox
                      id={`quote-${index}`}
                      checked={selectedQuoteIndices.has(index)}
                      onCheckedChange={() => handleToggleQuoteSelection(index)}
                      className="mt-1"
                    />
                    <div className="grid gap-2 flex-1">
                      <label htmlFor={`quote-${index}`} className="cursor-pointer">
                        <blockquote className="border-l-4 border-primary pl-4 text-md italic text-foreground/80">
                          {quote.text}
                        </blockquote>
                      </label>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="size-4" />
                        <span>{quote.author}</span>
                      </div>
                      {quote.tags && quote.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag className="size-4 text-muted-foreground" />
                          {quote.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        {discoveredQuotes.length > 0 && (
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDiscoveredQuotes([]);
              setSelectedQuoteIndices(new Set());
            }}>Search Again</Button>
            <Button onClick={handleAddSelectedQuotes} disabled={selectedQuoteIndices.size === 0}>
              Add {selectedQuoteIndices.size > 0 ? `(${selectedQuoteIndices.size})` : ''} to Vault
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
