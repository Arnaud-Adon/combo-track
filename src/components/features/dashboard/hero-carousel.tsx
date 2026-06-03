"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export type HeroSlide = {
  image: string;
  link: string;
  title: string;
  description?: string;
};

interface HeroCarouselProps {
  slides: HeroSlide[];
}

function ResourcePanel({ slide }: { slide: HeroSlide }) {
  return (
    <Link
      href={slide.link}
      target="_blank"
      className="group border-border bg-card relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-xl border p-6 transition-colors hover:border-primary/40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full opacity-50 blur-2xl"
        style={{ background: "var(--fgc-accent-soft)" }}
      />
      <div className="text-primary font-mono text-[10px] tracking-[0.2em] uppercase">
        Ressource
      </div>
      <h3 className="font-display mt-3 text-xl uppercase">{slide.title}</h3>
      {slide.description && (
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {slide.description}
        </p>
      )}
      <div className="text-muted-foreground group-hover:text-foreground mt-auto flex items-center gap-1.5 pt-6 font-mono text-xs tracking-wider uppercase transition-colors">
        Ouvrir
        <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [api]);

  if (slides.length === 0) {
    return (
      <div className="border-border bg-card text-muted-foreground flex h-full min-h-[260px] items-center justify-center rounded-xl border p-6 text-center">
        <p className="font-mono text-xs tracking-wider uppercase">
          Aucune ressource pour le moment
        </p>
      </div>
    );
  }

  if (slides.length === 1) {
    return <ResourcePanel slide={slides[0]} />;
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true, align: "center" }}
      className="h-full"
    >
      <CarouselContent className="h-full">
        {slides.map((slide, index) => (
          <CarouselItem key={index} className="h-full">
            <ResourcePanel slide={slide} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
