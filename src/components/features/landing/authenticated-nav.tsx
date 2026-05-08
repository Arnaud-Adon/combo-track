"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import { UserProfileDropdown } from "@/components/features/auth/user-profile-dropdown";
import { NavLink } from "@/components/features/landing/nav-link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AuthenticatedNavProps {
  user: {
    name: string;
    email: string;
    image: string | null;
    role?: string;
  };
}

export function AuthenticatedNav({ user }: AuthenticatedNavProps) {
  const pathname = usePathname();
  const isAdminActive = pathname.startsWith("/admin");

  return (
    <>
      <div className="hidden items-center gap-4 lg:flex">
        <NavLink href="/dashboard">Dashboard</NavLink>
        <NavLink href="/combos">Combos</NavLink>
        <NavLink href="/glossary">Glossaire</NavLink>
        <NavLink href="/stream">Stream</NavLink>
        {user.role === "ADMIN" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "gap-1",
                  isAdminActive &&
                    "bg-accent text-accent-foreground hover:bg-accent/80",
                )}
              >
                Admin
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/admin/glossary">Glossaire</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/games">Jeux</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/characters">Personnages</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <UserProfileDropdown user={user} />
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/combos">Combos</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/glossary">Glossaire</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/stream">Stream</Link>
            </DropdownMenuItem>
            {user.role === "ADMIN" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/admin/glossary">Glossaire</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/games">Jeux</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/characters">Personnages</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <UserProfileDropdown user={user} />
      </div>
    </>
  );
}
