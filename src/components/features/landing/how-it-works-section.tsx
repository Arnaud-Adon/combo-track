import { cn } from "@/lib/utils";

type HowItWorksSectionProps = {
  className?: string;
};

export function HowItWorksSection(props: HowItWorksSectionProps) {
  const { className } = props;

  const steps = [
    {
      number: "01",
      title: "Add a YouTube Video",
      description: "Paste any fighting game replay URL and get started.",
    },
    {
      number: "02",
      title: "Drop Your Notes",
      description: "Timestamp key moments, combos, and mistakes as you watch.",
    },
    {
      number: "03",
      title: "Study & Improve",
      description: "Review your notes and level up your game.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn("bg-accent/5 px-4 py-20", className)}
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-16 text-center text-4xl font-bold tracking-tight md:text-5xl">
          How It Works
        </h2>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-full text-2xl font-bold">
                  {step.number}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="mb-2 text-2xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-lg">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="ml-8 border-l-2 border-dashed border-primary/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
