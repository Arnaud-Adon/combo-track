"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CTASection() {
  return (
    <section className="space-y-6 text-center">
      <h1 className="text-5xl font-bold">
        <span className="bg-gradient-to-r from-zinc-400 via-white to-zinc-400 bg-clip-text text-transparent">
          Level Up Your Gameplay{" "}
        </span>
        <br />
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
          with ComboTrack
        </span>
      </h1>
      <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
        Stop rewatching the same matches over and over. Drop timestamped notes
        on your fighting game replays and actually remember what you learned.
        <br />
        <span className="font-medium text-white">Get good, faster.</span>
      </p>
      <div className="flex justify-center gap-4">
        <Button
          className="rounded-full font-semibold backdrop-blur transition-all hover:scale-105 hover:bg-zinc-200"
          variant="secondary"
          size="lg"
          onClick={() => {}}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle note personnelle
        </Button>
        <Button
          className="rounded-full border-2 border-white/20 bg-white/5 font-semibold backdrop-blur transition-all hover:scale-105 hover:bg-white/10"
          size="lg"
          onClick={() => {}}
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>YouTube</title>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          Nouvelle note de replay
        </Button>
      </div>
    </section>
  );
}
