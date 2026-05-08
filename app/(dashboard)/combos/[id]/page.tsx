import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireAuth } from "@/lib/auth-utils";
import { getComboById } from "@/../prisma/query/combo.query";
import { ComboDetail } from "@/components/features/combo/combo-detail";
import { Button } from "@/components/ui/button";

interface ComboPageProps {
  params: Promise<{ id: string }>;
}

export default async function ComboPage({ params }: ComboPageProps) {
  const user = await requireAuth();
  const { id } = await params;
  const combo = await getComboById({ id, userId: user.id });

  if (!combo) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/combos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux combos
        </Link>
      </Button>
      <ComboDetail combo={combo} />
    </div>
  );
}
