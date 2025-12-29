"use client";

import { AuthenticatedNav } from "@/components/features/landing/authenticated-nav";
import { UnauthenticatedNav } from "@/components/features/landing/unauthenticated-nav";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header
      className={cn(
        "w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">
              ComboTrack
            </span>
          </Link>

          {isPending ? (
            <div className="h-10 w-32" />
          ) : session?.user ? (
            <AuthenticatedNav
              user={{
                name: session.user.name,
                email: session.user.email,
                image: session.user.image ?? null,
              }}
            />
          ) : (
            <UnauthenticatedNav />
          )}
        </div>
      </div>
    </header>
  );
}
