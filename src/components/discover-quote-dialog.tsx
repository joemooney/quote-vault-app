"use client";

import { useState } from "react";
import { Wand2, Loader2, User, PlusCircle } from "lucide-react";
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
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

interface DiscoverQuoteDialogProps {
  onQuoteAdd: (text: string, author: string, tags: string[]) => void;
}

export default function DiscoverQuoteDialog({ onQuoteAdd }: DiscoverQuoteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gist, setGist] = useState("");
  const [discoveredQuote, setDiscoveredQuote] = useState<string | null>(null);
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const { toast } = useToast();

  const resetState = () => {
    setIsLoading(false);
    setGist("");
    setDiscoveredQuote(null);
    setAuthor("");
    setTags("");
  };

  const handleDiscover = async () => {
    if (!gist.trim()) return;
    setIsLoading(true);
    setDiscoveredQuote(null);
    const result = await handleDiscoverQuote(gist);
    setIsLoading(false);
    if (result.success && result.quote) {
      setDiscoveredQuote(result.quote);
    } else {
      toast({
        variant: "destructive",
        title: "Discovery Failed",
        description: result.error,
      });
    }
  };

  const handleAddQuote = () => {
    if (!discoveredQuote || !author.trim()) {
       toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide an author before adding the quote.",
      });
      return;
    }
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    onQuoteAdd(discoveredQuote, author, tagArray);
    toast({
      title: "Quote Added!",
      description: "The new quote has been added to your vault.",
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
          Discover Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Discover a New Quote</DialogTitle>
          <DialogDescription>
            Enter a gist or part of a quote, and we'll use AI to find the full text for you.
          </DialogDescription>
        </DialogHeader>
        
        {!discoveredQuote ? (
          <div className="grid gap-4 py-4">
            <Textarea
              id="gist"
              placeholder="e.g., something about great work and loving what you do"
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
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Discovered Quote:</h3>
            <Card>
              <CardHeader>
                 <blockquote className="border-l-4 border-primary pl-4 text-lg italic text-foreground/80">
                  {discoveredQuote}
                </blockquote>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input 
                    placeholder="Author Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="pl-9"
                  />
                </div>
                 <div className="relative">
                  <PlusCircle className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input 
                    placeholder="Tags (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {discoveredQuote && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiscoveredQuote(null)}>Search Again</Button>
            <Button onClick={handleAddQuote}>Add to Vault</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
