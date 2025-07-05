"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type Quote } from "@/lib/types";
import { handleExploreQuote } from "@/app/actions";
import { Loader2, BookOpen, BrainCircuit, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type ExploreQuoteOutput } from "@/ai/flows/explore-quote";

interface ExploreQuoteDialogProps {
  quote: Quote;
  children: React.ReactNode;
}

export default function ExploreQuoteDialog({ quote, children }: ExploreQuoteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExploreQuoteOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && !result) {
      setIsLoading(true);
      setError(null);
      const response = await handleExploreQuote(quote.text, quote.author);
      setIsLoading(false);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error ?? "An unknown error occurred.");
        toast({
          variant: "destructive",
          title: "Exploration Failed",
          description: response.error,
        });
        setIsOpen(false);
      }
    } else if (!open) {
      // Reset state when dialog is closed
      setTimeout(() => {
        setResult(null);
        setError(null);
        setIsLoading(false);
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Explore Quote</DialogTitle>
          <blockquote className="mt-2 border-l-4 border-primary pl-4 text-md italic text-foreground/80">
            "{quote.text}"
          </blockquote>
          <p className="text-right text-sm text-muted-foreground">- {quote.author}</p>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">AI is exploring the quote...</p>
            </div>
          )}
          {error && (
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div className="space-y-6">
              <div className="space-y-2">
                 <h3 className="flex items-center gap-2 text-lg font-semibold"><BrainCircuit className="size-5 text-primary"/> Meaning</h3>
                 <p className="text-muted-foreground">{result.meaning}</p>
              </div>
               <div className="space-y-2">
                 <h3 className="flex items-center gap-2 text-lg font-semibold"><History className="size-5 text-primary"/> Origin</h3>
                 <p className="text-muted-foreground">{result.origin}</p>
              </div>
               <div className="space-y-2">
                 <h3 className="flex items-center gap-2 text-lg font-semibold"><BookOpen className="size-5 text-primary"/> Trivia</h3>
                 <p className="text-muted-foreground">{result.trivia}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
