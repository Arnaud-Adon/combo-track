import { DashboardHero } from "@/components/features/dashboard/dashboard-hero";
import { QuickActions } from "@/components/features/dashboard/quick-actions";
import { RecentCombosSection } from "@/components/features/dashboard/recent-combos-section";
import { RecentMatchesSection } from "@/components/features/dashboard/recent-matches-section";
import { RecentStrategyMatricesSection } from "@/components/features/dashboard/recent-strategy-matrices-section";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getRecentCombosForUser } from "../../../prisma/query/combo.query";
import { getRecentMatches } from "../../../prisma/query/match.query";
import { getRecentStrategyMatrices } from "../../../prisma/query/strategy-matrix.query";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  const t = await getTranslations("dashboard");

  const [recentMatches, recentStrategyMatrices, recentCombos] =
    await Promise.all([
      getRecentMatches({ userId: session.user.id }),
      getRecentStrategyMatrices({ userId: session.user.id }),
      getRecentCombosForUser({ userId: session.user.id }),
    ]);

  const firstName =
    session.user.name?.trim().split(/\s+/)[0] ?? t("hero.fallbackName");

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 0%, var(--fgc-accent-soft) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 lg:px-8">
        <DashboardHero
          userName={firstName}
          slides={[
            {
              image: "",
              link: "https://fullmeter.com/fatonline/#/quicksearch",
              title: "Full Meter",
              description: t("resources.fullMeterDescription"),
            },
          ]}
        />

        <QuickActions />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <RecentStrategyMatricesSection matrices={recentStrategyMatrices} />
          <RecentMatchesSection matches={recentMatches} />
        </div>

        <RecentCombosSection combos={recentCombos} />
      </div>
    </div>
  );
}
