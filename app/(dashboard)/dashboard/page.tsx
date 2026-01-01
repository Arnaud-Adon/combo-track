import { CTASection } from "@/components/features/dashboard/cta-section";
import { HeroCarousel } from "@/components/features/dashboard/hero-carousel";
import { RecentMatchesSection } from "@/components/features/dashboard/recent-matches-section";
import { RecentNotesSection } from "@/components/features/dashboard/recent-notes-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getRecentMatches } from "../../../prisma/query/match.query";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  const recentMatches = await getRecentMatches({ userId: session.user.id });

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <HeroCarousel slides={[]} />
      </div>
      <CTASection />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RecentNotesSection />
        <RecentMatchesSection matches={recentMatches} />
      </div>
    </div>
  );
}
