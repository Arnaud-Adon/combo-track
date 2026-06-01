import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type FaqSectionProps = {
  className?: string;
};

const FAQ = [
  {
    q: "Quels jeux sont supportés ?",
    a: "SF6, Tekken 8 et Guilty Gear Strive sont disponibles au lancement. D'autres jeux sont ajoutés régulièrement. Le système de notation et de tags est générique — tu peux utiliser ComboTrack pour n'importe quel jeu de combat même si ton jeu n'est pas encore listé.",
  },
  {
    q: "Est-ce que le tier gratuit est vraiment utile ?",
    a: "Oui. Le tier gratuit te donne accès aux 4 modules (Match Notebook, Combo Notebook, Strategy Matrix, Glossaire) avec des limites raisonnables : 5 matches par mois, 20 combos, 2 matrices. Assez pour voir la valeur avant de t'engager.",
  },
  {
    q: "Comment fonctionne le rapport AI ?",
    a: "Tu annotes ton match, puis tu cliques « Générer le rapport ». L'IA (Groq, modèle Llama 3.3) analyse tes notes et produit un rapport structuré : résumé, 2-3 points forts, 1 point faible prioritaire, moments clés avec timecodes, et 2-3 recommandations d'exercices. Le rapport est sauvegardé avec le match.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, sans friction. Aucun engagement minimum, aucun appel de rétention. Tu gères ton abonnement depuis ton compte.",
  },
  {
    q: "L'IA peut vraiment remplir une Strategy Matrix ?",
    a: "Oui — et le résultat est calibré FGC. Tu fournis le contexte (ton perso, le perso adverse, les axes de ta matrice), l'IA génère chaque cellule avec une stratégie concrète en vocabulaire FGC (frame trap, whiff punish, oki, mixup). Tu édites ce qui ne te convient pas.",
  },
  {
    q: "Mes données sont-elles sauvegardées si je change de navigateur ?",
    a: "Tout est stocké dans le cloud, lié à ton compte. Tu accèdes à ComboTrack depuis n'importe quel navigateur ou machine avec ta session.",
  },
  {
    q: "C'est quoi la différence entre une note et un mémo ?",
    a: "Une note est timestampée et attachée à un match YouTube précis (« au timecode 1:23, oki setup wakeup »). Un mémo est un bloc-notes libre, sans vidéo ni perso obligatoire (« checklist tournoi », « routine d'échauffement », « idées de tech à tester »). Les deux sont indexés et remontent dans la recherche universelle ⌘K.",
  },
  {
    q: "La recherche fonctionne comment ?",
    a: "Recherche sémantique. Tu tapes une idée en langage naturel, ComboTrack remonte les notes, mémos et articles de glossaire qui ont du sens, même si les mots exacts ne sont pas là. Exemple : « comment punir un dive kick » trouve une note où tu as écrit « DP anti-air sur jump-in Akuma ». Raccourci ⌘K (ou Ctrl+K) accessible depuis n'importe quel écran.",
  },
];

export function FaqSection(props: FaqSectionProps) {
  const { className } = props;

  return (
    <section
      id="faq"
      className={cn(
        "bg-fgc-bg text-fgc-text relative border-t",
        "border-fgc-border",
        className,
      )}
    >
      <div className="relative mx-auto max-w-3xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mb-12 md:mb-16">
          <span className="font-mono-fgc text-accent-fgc mb-4 inline-block text-[10px] tracking-[0.3em] uppercase">
            {"// FAQ"}
          </span>
          <h2 className="marketing-h1 text-fgc-text text-4xl md:text-5xl lg:text-6xl">
            Les questions
            <br />
            <span className="text-fgc-muted">qu&apos;on nous pose le plus.</span>
          </h2>
        </div>

        <div className="divide-fgc-border border-fgc-border divide-y border-y">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group/faq peer/faq open:bg-fgc-surface/30 marker:hidden"
            >
              <summary className="text-fgc-text hover:text-accent-fgc flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-base font-medium transition-colors md:text-lg [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <Plus
                  className="text-fgc-muted mt-1 size-5 shrink-0 transition-transform group-open/faq:rotate-45"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </summary>
              <p className="text-fgc-muted pr-10 pb-6 text-sm leading-relaxed md:text-[15px]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
