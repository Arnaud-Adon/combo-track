import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

type FeaturesSectionProps = {
  className?: string;
};

export function FeaturesSection(props: FeaturesSectionProps) {
  const { className } = props;

  const features = [
    {
      src: "/clock-loader-40-0.svg",
      title: "Timestamped Notes",
      description:
        "Take notes at exact moments in YouTube videos. No more scrubbing through footage trying to find that one combo.",
    },
    {
      src: "/local-library-2.svg",
      title: "Organize Your Replays",
      description:
        "Keep all your matches in one place. Your personal fighting game library, always ready when you need it.",
    },
    {
      src: "/rocket-launch-1.svg",
      title: "Level Up Faster",
      description:
        "Analyze your gameplay and learn from every match. Turn losses into lessons and wins into wisdom.",
    },
  ];

  return (
    <section className={cn("px-4 py-20", className)}>
      <div className="mx-auto max-w-6xl space-y-12">
        <h2 className="text-center text-4xl font-bold tracking-tight md:text-5xl">
          Master Every Match
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="flex flex-col items-center bg-background border border-foreground text-foreground"
            >
              <CardTitle>{feature.title}</CardTitle>
              <CardContent className="flex gap-4 items-center">
                <Image
                  src={feature.src}
                  alt={feature.title}
                  width={40}
                  height={40}
                />
                <CardDescription className="text-foreground text-start text-lg">
                  <p>{feature.description}</p>
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
