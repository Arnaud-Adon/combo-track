"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (pathname.startsWith(href) && pathname[href.length] === "/");

  return (
    <Link href={href} aria-current={isActive ? "page" : undefined}>
      <Button
        variant="ghost"
        className={cn(
          isActive && "bg-accent text-accent-foreground hover:bg-accent/80",
        )}
      >
        {children}
      </Button>
    </Link>
  );
}
