import {
  BookOpen,
  Clapperboard,
  Grid3x3,
  NotebookPen,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type ModuleTile = {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
};

export async function QuickActions() {
  const t = await getTranslations("dashboard");

  const modules: ModuleTile[] = [
    {
      href: "/videos",
      label: t("quickActions.modules.replays.label"),
      hint: t("quickActions.modules.replays.hint"),
      icon: Clapperboard,
    },
    {
      href: "/combos",
      label: t("quickActions.modules.combos.label"),
      hint: t("quickActions.modules.combos.hint"),
      icon: Swords,
    },
    {
      href: "/notes/strategy",
      label: t("quickActions.modules.matrices.label"),
      hint: t("quickActions.modules.matrices.hint"),
      icon: Grid3x3,
    },
    {
      href: "/notes/memo",
      label: t("quickActions.modules.memos.label"),
      hint: t("quickActions.modules.memos.hint"),
      icon: NotebookPen,
    },
    {
      href: "/glossary",
      label: t("quickActions.modules.glossary.label"),
      hint: t("quickActions.modules.glossary.hint"),
      icon: BookOpen,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="text-primary font-mono text-xs">00</span>
        <h2 className="font-display text-xl uppercase md:text-2xl">
          {t("quickActions.title")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.href}
              href={module.href}
              className="group fgc-rise border-border bg-card hover:border-primary/40 flex flex-col rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <div className="bg-accent text-primary flex size-9 items-center justify-center rounded-md">
                <Icon className="size-4.5" />
              </div>
              <div className="font-display mt-3 text-sm uppercase">
                {module.label}
              </div>
              <div className="text-muted-foreground font-mono text-[11px]">
                {module.hint}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
