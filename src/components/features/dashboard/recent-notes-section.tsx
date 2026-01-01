import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecentNotesSection() {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Dernières notes personnelles</h2>
        <span className="text-sm text-muted-foreground">
          Bientôt disponible
        </span>
      </div>

      <div className="text-center py-12 space-y-4">
        <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto" />
        <div>
          <p className="text-muted-foreground">
            Aucune note personnelle pour le moment
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Cette fonctionnalité sera disponible prochainement
          </p>
        </div>
        <Button variant="outline" size="sm" disabled>
          Créer ma première note
        </Button>
      </div>
    </section>
  );
}
