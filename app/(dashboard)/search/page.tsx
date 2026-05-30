import { SemanticSearchBar } from "@/components/features/search/semantic-search-bar";

export const metadata = {
  title: "Recherche sémantique",
};

export default function SearchPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Recherche sémantique</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Cherche dans tes notes timestampées et les articles du glossaire par
          sens, pas seulement par mots-clés.
        </p>
      </header>
      <SemanticSearchBar />
    </div>
  );
}
