import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

export function Footer(props: FooterProps) {
  const { className } = props;

  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("border-t px-4 py-12", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-xl font-bold">ComboTrack</div>

          <nav className="flex gap-6">
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="text-muted-foreground mt-8 text-center text-sm">
          © {currentYear} ComboTrack. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
