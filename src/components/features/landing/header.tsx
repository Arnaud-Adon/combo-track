"use client";

import { AuthenticatedNav } from "@/components/features/landing/authenticated-nav";
import { UnauthenticatedNav } from "@/components/features/landing/unauthenticated-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUserRole } from "@/hooks/use-user-role";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#benefits", label: "Bénéfices" },
  { href: "#walkthrough", label: "Produit" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const { data: session, isPending } = useSession();
  const { role } = useUserRole();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-fgc-border bg-fgc-bg/80 border-b backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="border-fgc-accent/40 bg-fgc-accent/10 text-fgc-accent font-mono-fgc relative flex size-7 items-center justify-center rounded-sm border text-[11px] font-bold"
            >
              CT
            </span>
            <span className="font-display text-fgc-text text-base tracking-wider uppercase">
              ComboTrack
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-fgc-muted hover:text-fgc-text rounded-md px-3 py-1.5 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="h-10 w-32" />
            ) : session?.user ? (
              <AuthenticatedNav
                user={{
                  name: session.user.name,
                  email: session.user.email,
                  image: session.user.image ?? null,
                  role: role ?? undefined,
                }}
              />
            ) : (
              <UnauthenticatedNav />
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
