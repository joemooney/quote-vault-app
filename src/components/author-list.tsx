"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Users } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AuthorListProps {
  quotes: Quote[];
}

export default function AuthorList({ quotes }: AuthorListProps) {
  const searchParams = useSearchParams();
  const activeAuthor = searchParams.get("author");

  const authors = useMemo(() => {
    const authorSet = new Set<string>();
    quotes.forEach((quote) => authorSet.add(quote.author));
    return Array.from(authorSet).sort();
  }, [quotes]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center gap-2">
        <Users className="size-4" />
        Authors
      </SidebarGroupLabel>
      <SidebarMenu>
        {authors.map((author) => (
          <SidebarMenuItem key={author}>
            <Link href={`?author=${encodeURIComponent(author)}`} className="w-full" legacyBehavior>
              <SidebarMenuButton
                size="sm"
                isActive={activeAuthor === author}
                className={cn("w-full justify-start", activeAuthor === author && "font-semibold")}
              >
                {author}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
