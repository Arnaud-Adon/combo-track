"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type MobileCtaBarProps = {
  className?: string;
};

export function MobileCtaBar(props: MobileCtaBarProps) {
  const { className } = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 480);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "border-fgc-border bg-fgc-bg/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
        className,
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="font-mono-fgc text-fgc-accent text-[10px] tracking-widest uppercase">
            Free forever
          </div>
          <div className="text-fgc-text truncate text-sm font-medium">
            Ton labo FGC, en 30 secondes.
          </div>
        </div>
        <Button
          asChild
          className="bg-fgc-accent hover:bg-fgc-accent-strong h-10 shrink-0 text-sm text-white"
        >
          <Link href="/signup" className="flex items-center gap-1.5">
            Commencer
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
