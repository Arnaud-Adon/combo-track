import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ComboNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Combo introuvable</h1>
      <p className="text-muted-foreground mt-2">
        Ce combo n&apos;existe pas ou ne vous appartient pas.
      </p>
      <Button asChild className="mt-6">
        <Link href="/combos">Voir mes combos</Link>
      </Button>
    </div>
  );
}
