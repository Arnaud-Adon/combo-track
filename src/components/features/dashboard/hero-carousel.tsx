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
      <div className="h-[400px] rounded-3xl bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 p-12 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-2xl font-semibold">
            Aucun slide configuré pour le moment
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
              <div className="h-[400px] rounded-3xl bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 p-12 flex flex-col items-center justify-center text-center text-white hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
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
