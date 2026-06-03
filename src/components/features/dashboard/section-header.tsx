import { ArrowRight } from "lucide-react";
import Link from "next/link";

type SectionHeaderProps = {
  index: string;
  title: string;
  href: string;
  linkLabel?: string;
};

export function SectionHeader(props: SectionHeaderProps) {
  const { index, title, href, linkLabel = "Voir tout" } = props;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-primary font-mono text-xs">{index}</span>
          <h2 className="font-display text-xl uppercase md:text-2xl">{title}</h2>
        </div>
        <Link
          href={href}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 font-mono text-xs tracking-wider uppercase transition-colors"
        >
          {linkLabel}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--border) 0%, var(--border) 40%, transparent 100%)",
        }}
      />
    </div>
  );
}
