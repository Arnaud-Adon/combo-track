"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

export function StrategyMatrixHelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <HelpCircle className="mr-2 h-4 w-4" />
          Mode d&apos;emploi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Comment utiliser une matrice de stratégie ?</DialogTitle>
          <DialogDescription>
            Une matrice croise <strong>votre état</strong> (colonnes) et{" "}
            <strong>l&apos;état adverse</strong> (lignes). Chaque cellule
            contient l&apos;action optimale pour cette combinaison de
            ressources.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          <section className="space-y-2">
            <h3 className="text-base font-semibold">Étapes</h3>
            <ol className="text-muted-foreground list-decimal space-y-1.5 pl-5">
              <li>
                <strong className="text-foreground">Choisir un modèle</strong>{" "}
                (HP × Meter, Drive × Position, ou Vide) ou partir d&apos;une
                base existante.
              </li>
              <li>
                <strong className="text-foreground">Donner un titre</strong>{" "}
                clair (ex: «&nbsp;Ken vs Juri — défense&nbsp;»).
              </li>
              <li>
                <strong className="text-foreground">Définir les axes</strong> :
                un libellé, un type de ressource (HP, Meter, Drive, Position,
                Custom) et de 2 à 5 niveaux par axe.
              </li>
              <li>
                <strong className="text-foreground">Cliquer une cellule</strong>{" "}
                pour ouvrir l&apos;éditeur markdown et décrire la stratégie
                optimale.
              </li>
              <li>
                <strong className="text-foreground">Enregistrer</strong> — la
                matrice est consultable ensuite avant un match.
              </li>
            </ol>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-semibold">Exemple concret</h3>
            <p className="text-muted-foreground">
              Matrice : <em>Mon Drive Gauge</em> (colonnes) ×{" "}
              <em>Position adversaire</em> (lignes).
            </p>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left font-semibold"></th>
                    <th className="p-2 text-left font-semibold">
                      Drive plein
                    </th>
                    <th className="p-2 text-left font-semibold">
                      Drive moyen
                    </th>
                    <th className="p-2 text-left font-semibold">Burnout</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="bg-muted/40 p-2 font-semibold">Midscreen</td>
                    <td className="p-2">
                      Pression DR + mixup, hit confirm Super 2
                    </td>
                    <td className="p-2">Whiff punish safe, garder 1 bar</td>
                    <td className="p-2">
                      Backdash pour reset spacing, bloquer haut
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="bg-muted/40 p-2 font-semibold">Corner</td>
                    <td className="p-2">
                      Throw loop unreactable, kill confirm
                    </td>
                    <td className="p-2">
                      Frame trap cr.MK xx DR → mixup overhead/low
                    </td>
                    <td className="p-2">
                      Pas de DI possible, jouer pour timeout
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground italic">
              Astuce : dans une cellule, le markdown est supporté (gras, listes,
              flèches `→`). Compteur 2000 caractères max par cellule.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-semibold">Bonnes pratiques</h3>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5">
              <li>
                Une matrice = <strong>une situation</strong> précise (un
                matchup, une phase de jeu).
              </li>
              <li>
                Garder 2-3 niveaux par axe au début. Ajouter de la granularité
                quand vous maîtrisez la base.
              </li>
              <li>
                Si vous modifiez un axe (ajout/suppression de niveau), les
                cellules orphelines sont purgées et les nouvelles cellules sont
                créées vides.
              </li>
              <li>
                Consultable depuis <code>/notes/strategy</code>. Idéal avant un
                match comme fiche de révision.
              </li>
            </ul>
          </section>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Compris</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
