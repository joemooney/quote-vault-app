"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { quotesData } from "@/lib/data";
import type { Quote } from "@/lib/types";
import { Search, Home } from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import AuthorList from "@/components/author-list";
import TagList from "@/components/tag-list";
import QuoteList from "@/components/quote-list";
import { QuoteIcon } from "@/components/icons";
import DiscoverQuoteDialog from "@/components/discover-quote-dialog";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function QuoteVaultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quotes, setQuotes] = useState<Quote[]>(quotesData);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const authorFilter = searchParams.get("author");
  const tagFilter = searchParams.get("tag");

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesAuthor = !authorFilter || quote.author === authorFilter;
      const matchesTag = !tagFilter || quote.tags.includes(tagFilter);
      const matchesSearch =
        !searchQuery ||
        quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesAuthor && matchesTag && matchesSearch;
    });
  }, [quotes, authorFilter, tagFilter, searchQuery]);

  const handleAddQuote = (text: string, author: string, tags: string[]) => {
    const newQuote: Quote = {
      id: Math.max(0, ...quotes.map(q => q.id)) + 1,
      text,
      author,
      tags,
    };
    setQuotes((prev) => [newQuote, ...prev]);
  };
  
  const handleClearFilters = () => {
    router.push('/');
  };

  const handleDeleteQuote = (id: number) => {
    setQuotes((prev) => prev.filter((quote) => quote.id !== id));
    toast({
      title: "Quote Deleted",
      description: "The quote has been removed from your vault.",
    });
  };

  const handleAddTagToQuote = (quoteId: number, tag: string) => {
    setQuotes((prev) =>
      prev.map((quote) => {
        if (quote.id === quoteId) {
          if (!quote.tags.includes(tag)) {
            return { ...quote, tags: [...quote.tags, tag] };
          }
        }
        return quote;
      })
    );
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <QuoteIcon className="size-8 text-primary" />
            <h1 className="text-xl font-semibold font-headline">Quote Vault</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
           <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" className="w-full" legacyBehavior>
                <SidebarMenuButton size="sm" onClick={handleClearFilters} isActive={!authorFilter && !tagFilter} className="w-full justify-start">
                   <Home className="size-4" /> All Quotes
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator />
          <AuthorList quotes={quotes} />
          <SidebarSeparator />
          <TagList quotes={quotes} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-6">
          <header className="flex items-center justify-between gap-4">
             <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-2xl font-bold font-headline">
                {authorFilter
                  ? `Quotes by ${authorFilter}`
                  : tagFilter
                  ? `Quotes tagged "${tagFilter}"`
                  : "All Quotes"}
              </h2>
            </div>
            <DiscoverQuoteDialog onQuoteAdd={handleAddQuote} />
          </header>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quotes, authors, or tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <main className="flex-1">
            <QuoteList quotes={filteredQuotes} onDelete={handleDeleteQuote} onAddTag={handleAddTagToQuote} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
