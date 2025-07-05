import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Quote } from "@/lib/types";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ExploreQuoteDialog from "./explore-quote-dialog";
import { AiIcon } from "./icons";
import type { ExploreQuoteOutput } from "@/ai/flows/explore-quote";

interface QuoteCardProps {
  quote: Quote;
  onDelete: (id: number) => void;
  onAddTag: (quoteId: number, tag: string) => void;
  onUpdateExploration: (quoteId: number, explorationData: ExploreQuoteOutput) => void;
}

export default function QuoteCard({ quote, onDelete, onAddTag, onUpdateExploration }: QuoteCardProps) {
  const [newTag, setNewTag] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { toast } = useToast();

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag === "") {
      toast({ variant: "destructive", description: "Tag cannot be empty." });
      return;
    }
    if (quote.tags.map(t => t.toLowerCase()).includes(trimmedTag)) {
      toast({ variant: "destructive", description: "Tag already exists." });
      return;
    }
    onAddTag(quote.id, newTag.trim());
    setNewTag("");
    setPopoverOpen(false);
    toast({ description: `Tag "${newTag.trim()}" added.` });
  };

  return (
    <Card className="flex h-full flex-col transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <blockquote className="border-l-4 border-primary pl-4 text-lg italic text-foreground/80">
          {quote.text}
        </blockquote>
      </CardHeader>
      <CardContent className="flex-grow">
        <Link href={`?author=${encodeURIComponent(quote.author)}`} className="font-medium text-primary hover:underline">
          - {quote.author}
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          {quote.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer capitalize transition-colors hover:bg-accent hover:text-accent-foreground"
                asChild
              >
                <Link href={`?tag=${encodeURIComponent(tag)}`}>{tag}</Link>
              </Badge>
          ))}
        </div>
        <div className="mt-auto flex w-full items-center justify-end gap-1 self-end pt-2">
          <ExploreQuoteDialog quote={quote} onUpdateExploration={onUpdateExploration}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary/70 hover:bg-primary/10 hover:text-primary"
            >
              <AiIcon className="size-5" />
              <span className="sr-only">Explore Quote</span>
            </Button>
          </ExploreQuoteDialog>

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="size-4" />
                <span className="sr-only">Add Tag</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="flex gap-2">
                <Input
                  placeholder="New tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button size="sm" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Delete Quote</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the quote.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(quote.id)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
