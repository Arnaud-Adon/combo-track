"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroCarouselProps {
  slides: {
    image: string;
    link: string;
    title: string;
    description?: string;
  }[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const timer = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(timer);
  }, [api]);

  if (slides.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 p-12">
        <div className="text-center text-white">
          <p className="text-2xl font-semibold">
            Aucune slide configurée pour le moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <Carousel setApi={setApi} opts={{ loop: true, align: "center" }}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={index}>
            <Link href={slide.link}>
              <div className="flex h-[400px] cursor-pointer flex-col items-center justify-center rounded-3xl bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 p-12 text-center text-white transition-transform duration-300 hover:scale-[1.02]">
                <h2 className="mb-4 text-4xl font-bold">{slide.title}</h2>
                {slide.description && (
                  <p className="text-lg opacity-90">{slide.description}</p>
                )}
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
