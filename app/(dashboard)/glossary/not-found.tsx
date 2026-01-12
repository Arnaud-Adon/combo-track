import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <FileQuestion className="text-muted-foreground mb-4 h-16 w-16" />
      <h2 className="mb-2 text-2xl font-bold">Article non trouvé</h2>
      <p className="text-muted-foreground mb-6">
        L&apos;article que vous recherchez n&apos;existe pas ou n&apos;est pas
        publié.
      </p>
      <Link href="/glossary">
        <Button variant="outline">Retour au glossaire</Button>
      </Link>
    </div>
  );
}
