import { SemanticSearchBar } from "@/components/features/search/semantic-search-bar";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("search");

  return {
    title: t("metadata.title"),
  };
}

export default async function SearchPage() {
  const t = await getTranslations("search");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-display">{t("page.title")}</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {t("page.description")}
        </p>
      </header>
      <SemanticSearchBar />
    </div>
  );
}
