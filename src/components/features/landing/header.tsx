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
        "border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-b backdrop-blur",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              ComboTrack
            </h1>
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
