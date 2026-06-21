import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "./section-header";

type RecentSectionProps<T> = {
  items: T[];
  /** Renders one item's card. */
  renderItem: (item: T, index: number) => ReactNode;
  /** `grid` (3-col cards) or `list` (stacked rows). Defaults to `list`. */
  layout?: "grid" | "list";
  /** Section header order index, e.g. `"01"`. */
  index: string;
  /** Section title (already translated). */
  title: string;
  viewAllHref: string;
  /** Empty-state copy (already translated). */
  emptyText: string;
  emptyHint: string;
  /** "Create new" call to action. */
  newHref: string;
  newLabel: string;
};

/**
 * Dashboard "recent <entity>" section: header + empty state + animated card
 * grid/list. Generic over the item type — callers provide the card via
 * {@link RecentSectionProps.renderItem}.
 */
export function RecentSection<T extends { id: string }>({
  items,
  renderItem,
  layout = "list",
  index,
  title,
  viewAllHref,
  emptyText,
  emptyHint,
  newHref,
  newLabel,
}: RecentSectionProps<T>) {
  return (
    <section className="space-y-5">
      <SectionHeader index={index} title={title} href={viewAllHref} />

      {items.length === 0 ? (
        <div className="border-border text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center">
          <p className="font-mono text-sm">{emptyText}</p>
          <p className="text-sm">{emptyHint}</p>
          <Button asChild variant="outline" size="sm" className="mt-1">
            <Link href={newHref}>
              <Plus className="size-4" />
              {newLabel}
            </Link>
          </Button>
        </div>
      ) : (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-3"
          }
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className="fgc-rise"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
