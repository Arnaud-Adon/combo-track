import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecentNotesSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dernières notes personnelles</h2>
        <span className="text-muted-foreground text-sm">
          Bientôt disponible
        </span>
      </div>

      <div className="space-y-4 py-12 text-center">
        <FileText className="text-muted-foreground/50 mx-auto h-12 w-12" />
        <div>
          <p className="text-muted-foreground">
            Aucune note personnelle pour le moment
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
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
