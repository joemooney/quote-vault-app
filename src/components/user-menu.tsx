"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, AlertTriangle } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function UserMenu() {
  const { user, loading, signInWithGoogle, signOut, isConfigured } = useAuth();

  if (!isConfigured) {
    return (
      <div className="p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-help items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-destructive transition-colors hover:bg-destructive/20"
              >
                <AlertTriangle className="shrink-0 size-5" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">Action Required</span>
                  <span className="text-xs">Configure Firebase</span>
                </div>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right" align="start" className="max-w-xs">
              <p className="font-semibold">Firebase credentials are missing.</p>
              <p className="text-muted-foreground">
                Click to open the Firebase Console, then create a new Web App in
                your project settings to get your credentials. Copy them into
                the `.env` file.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-2">
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-2">
        <Button onClick={signInWithGoogle} variant="outline" className="w-full">
          <LogIn className="mr-2" />
          Sign In with Google
        </Button>
      </div>
    );
  }

  const userInitial = user.displayName?.charAt(0) || user.email?.charAt(0) || "?";

  return (
    <div className="p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-full justify-start gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? "User Avatar"} />
              <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left overflow-hidden">
               <span className="text-sm font-medium truncate">{user.displayName ?? "User"}</span>
               <span className="text-xs text-muted-foreground truncate">{user.email ?? ""}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
