import { cn } from "@/lib/utils";
import { Play, Sparkles } from "lucide-react";

type HeroProductMockProps = {
  className?: string;
};

const TIMESTAMPS = [
  { time: "0:14", label: "Drive Rush whiff punish", accent: false },
  { time: "0:32", label: "Anti-air DP — confirmé en super", accent: true },
  { time: "1:08", label: "Throw loop oki sur wakeup", accent: false },
  { time: "1:47", label: "Erreur neutral — burned 2 drive", accent: false },
];

export function HeroProductMock(props: HeroProductMockProps) {
  const { className } = props;

  return (
    <div
      className={cn(
        "border-fgc-border bg-fgc-surface relative w-full overflow-hidden rounded-xl border shadow-2xl",
        "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)_inset]",
        className,
      )}
    >
      <div className="border-fgc-border bg-fgc-bg/80 flex items-center gap-2 border-b px-3 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-500/70" />
          <span className="size-2.5 rounded-full bg-yellow-500/70" />
          <span className="size-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="text-fgc-muted font-mono-fgc ml-2 truncate text-[10px] tracking-wider uppercase">
          replay · sf6 · luke vs jp · ranked diamond
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
        <div className="bg-fgc-bg relative aspect-video md:aspect-auto md:min-h-[320px]">
          <div className="from-fgc-bg via-fgc-surface to-fgc-bg absolute inset-0 bg-gradient-to-br" />
          <div className="bg-scanlines absolute inset-0 opacity-60" />
          <div className="bg-grain absolute inset-0 opacity-[0.06] mix-blend-overlay" />

          <div className="relative flex h-full items-center justify-center">
            <div className="border-fgc-accent/40 bg-fgc-accent/10 flex size-16 items-center justify-center rounded-full border backdrop-blur-sm">
              <Play
                className="text-fgc-accent ml-1 size-7"
                fill="currentColor"
              />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className="border-fgc-border bg-fgc-bg/70 flex items-center gap-2 rounded-md border px-2.5 py-1.5 backdrop-blur">
              <span className="font-mono-fgc text-fgc-text text-[10px] tracking-wider">
                01:47
              </span>
              <div className="bg-fgc-border relative h-1 flex-1 overflow-hidden rounded-full">
                <div className="bg-fgc-accent absolute inset-y-0 left-0 w-[42%]" />
                <span className="bg-fgc-accent absolute top-1/2 left-[42%] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white/20" />
              </div>
              <span className="font-mono-fgc text-fgc-muted text-[10px] tracking-wider">
                04:12
              </span>
            </div>
          </div>
        </div>

        <div className="border-fgc-border bg-fgc-bg flex flex-col gap-2 border-t p-3 md:border-t-0 md:border-l">
          <div className="flex items-center justify-between">
            <span className="font-mono-fgc text-fgc-muted text-[10px] tracking-[0.2em] uppercase">
              Notes timestampées
            </span>
            <span className="text-fgc-accent font-mono-fgc text-[10px]">
              {TIMESTAMPS.length}
            </span>
          </div>

          <ul className="space-y-1.5">
            {TIMESTAMPS.map((note, idx) => (
              <li
                key={note.time}
                className={cn(
                  "fgc-rise border-fgc-border bg-fgc-surface flex items-start gap-2 rounded-md border px-2.5 py-2",
                  note.accent && "border-fgc-accent/40 bg-fgc-accent-soft",
                )}
                style={{
                  animationDelay: `${0.4 + idx * 0.12}s`,
                }}
              >
                <span
                  className={cn(
                    "font-mono-fgc shrink-0 text-[10px] tracking-wider",
                    note.accent ? "text-fgc-accent" : "text-fgc-muted",
                  )}
                >
                  {note.time}
                </span>
                <span className="text-fgc-text text-[11px] leading-snug">
                  {note.label}
                </span>
              </li>
            ))}
          </ul>

          <div
            className="fgc-rise border-fgc-accent/30 bg-fgc-accent-soft mt-auto flex items-center gap-2 rounded-md border px-2.5 py-2"
            style={{ animationDelay: "1s" }}
          >
            <Sparkles className="text-fgc-accent size-3.5 shrink-0" />
            <span className="text-fgc-text text-[11px] leading-snug">
              Génère le rapport IA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
