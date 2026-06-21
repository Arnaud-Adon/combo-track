"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";

import { UserProfileDropdown } from "@/components/features/auth/user-profile-dropdown";
import { NavLink } from "@/components/features/landing/nav-link";
import { SearchCommandDialog } from "@/components/features/search/search-command-dialog";
import { SearchTriggerButton } from "@/components/features/search/search-trigger-button";
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
  const t = useTranslations("landing");
  const pathname = usePathname();
  const isAdminActive = pathname.startsWith("/admin");

  return (
    <>
      <div className="hidden items-center gap-4 lg:flex">
        <NavLink href="/dashboard">{t("nav.authenticated.dashboard")}</NavLink>
        <NavLink href="/stream">{t("nav.authenticated.stream")}</NavLink>
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
                {t("nav.authenticated.admin")}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/admin/glossary">
                  {t("nav.authenticated.glossary")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/games">{t("nav.authenticated.games")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/characters">
                  {t("nav.authenticated.characters")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <SearchTriggerButton />
        <UserProfileDropdown user={user} />
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <SearchTriggerButton />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("nav.authenticated.menuLabel")}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {t("nav.authenticated.labHeading")}
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/videos">{t("nav.authenticated.replays")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/combos">{t("nav.authenticated.combos")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/notes/strategy">
                {t("nav.authenticated.matrices")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/notes/memo">{t("nav.authenticated.memos")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/glossary">{t("nav.authenticated.glossary")}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                {t("nav.authenticated.dashboard")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/stream">{t("nav.authenticated.stream")}</Link>
            </DropdownMenuItem>
            {user.role === "ADMIN" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  {t("nav.authenticated.admin")}
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/admin/glossary">
                    {t("nav.authenticated.glossary")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/games">
                    {t("nav.authenticated.games")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/characters">
                    {t("nav.authenticated.characters")}
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <UserProfileDropdown user={user} />
      </div>

      <SearchCommandDialog />
    </>
  );
}
