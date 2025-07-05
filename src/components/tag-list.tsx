"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Tag } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  sidebarMenuButtonVariants,
} from "@/components/ui/sidebar";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TagListProps {
  quotes: Quote[];
}

export default function TagList({ quotes }: TagListProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    quotes.forEach((quote) => quote.tags.forEach((tag) => tagSet.add(tag.toLowerCase())));
    return Array.from(tagSet).sort();
  }, [quotes]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center gap-2">
        <Tag className="size-4" />
        Tags
      </SidebarGroupLabel>
      <SidebarMenu>
        {tags.map((tag) => (
          <SidebarMenuItem key={tag}>
            <Link
              href={`?tag=${encodeURIComponent(tag)}`}
              data-active={activeTag === tag}
              className={cn(
                sidebarMenuButtonVariants({ size: "sm" }),
                "justify-start capitalize",
                activeTag === tag && "font-semibold"
              )}
            >
              {tag}
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
