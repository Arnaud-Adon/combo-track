"use client";

import {
  BookOpen,
  Clapperboard,
  Grid3x3,
  NotebookPen,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type RailItem = {
  href: string;
  labelKey: "replays" | "combos" | "matrices" | "memos" | "glossary";
  icon: LucideIcon;
};

const RAIL_ITEMS: RailItem[] = [
  { href: "/videos", labelKey: "replays", icon: Clapperboard },
  { href: "/combos", labelKey: "combos", icon: Swords },
  { href: "/notes/strategy", labelKey: "matrices", icon: Grid3x3 },
  { href: "/notes/memo", labelKey: "memos", icon: NotebookPen },
  { href: "/glossary", labelKey: "glossary", icon: BookOpen },
];

export function QuickRail() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  if (isPending || !session?.user || pathname === "/") {
    return null;
  }

  return (
    <TooltipProvider delayDuration={150}>
      <nav
        aria-label={t("rail.ariaLabel")}
        className="fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 lg:block"
      >
        <ul className="border-border bg-card/80 supports-[backdrop-filter]:bg-card/60 flex flex-col items-center gap-1 rounded-2xl border p-1.5 shadow-lg backdrop-blur-md">
          {RAIL_ITEMS.map((item) => {
            const Icon = item.icon;
            const label = t(`rail.${item.labelKey}`);
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      aria-label={label}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "focus-visible:ring-ring relative flex size-11 items-center justify-center rounded-xl outline-none transition-colors focus-visible:ring-2",
                        isActive
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                      )}
                    >
                      {isActive ? (
                        <span
                          aria-hidden
                          className="bg-primary absolute top-1/2 -right-1.5 h-5 w-1 -translate-y-1/2 rounded-full"
                        />
                      ) : null}
                      <Icon aria-hidden className="size-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left" sideOffset={12}>
                    {label}
                  </TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>
    </TooltipProvider>
  );
}
