import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("glossary");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <FileQuestion className="text-muted-foreground mb-4 h-16 w-16" />
      <h2 className="mb-2 text-2xl font-bold font-display">
        {t("notFound.title")}
      </h2>
      <p className="text-muted-foreground mb-6">{t("notFound.description")}</p>
      <Link href="/glossary">
        <Button variant="outline">{t("backToGlossary")}</Button>
      </Link>
    </div>
  );
}
