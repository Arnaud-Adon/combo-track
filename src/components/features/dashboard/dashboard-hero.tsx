import { ArrowRight, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CmdkTriggerButton } from "./cmdk-trigger-button";
import { HeroCarousel, type HeroSlide } from "./hero-carousel";

type DashboardHeroProps = {
  userName: string;
  slides: HeroSlide[];
};

export async function DashboardHero(props: DashboardHeroProps) {
  const { userName, slides } = props;
  const t = await getTranslations("dashboard");

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <section className="relative grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-stretch">
      <div className="flex flex-col">
        <div
          className="fgc-rise border-border bg-card/70 text-muted-foreground mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 backdrop-blur"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="bg-primary relative flex size-1.5 rounded-full">
            <span className="bg-primary absolute inset-0 animate-ping rounded-full opacity-60" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
            {t("hero.eyebrow", { date: today })}
          </span>
        </div>

        <h1
          className="font-display fgc-rise text-3xl uppercase md:text-4xl lg:text-5xl"
          style={{ animationDelay: "0.15s" }}
        >
          {t("hero.greeting", { name: userName })}
          <br />
          <span className="text-muted-foreground">{t("hero.greetingSub")}</span>
        </h1>

        <p
          className="text-muted-foreground fgc-rise mt-6 max-w-xl text-base leading-relaxed"
          style={{ animationDelay: "0.3s" }}
        >
          {t("hero.description")}
        </p>

        <div
          className="fgc-rise mt-8 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "0.45s" }}
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-fgc-accent-strong h-12 text-base text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_20px_40px_-10px_var(--fgc-accent-soft)]"
          >
            <Link href="/videos/new" className="flex items-center gap-2">
              <Plus className="size-4" />
              {t("actions.newReplay")}
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 text-base"
          >
            <Link href="/notes/strategy/new" className="flex items-center gap-2">
              {t("actions.newMatrix")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <CmdkTriggerButton />
        </div>
      </div>

      <div className="fgc-rise" style={{ animationDelay: "0.4s" }}>
        <HeroCarousel slides={slides} />
      </div>
    </section>
  );
}
