"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  return (
    <header className={cn("w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">ComboTrack</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/videos">
              <Button variant="ghost">My Videos</Button>
            </Link>
            <Link href="/api/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/api/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
