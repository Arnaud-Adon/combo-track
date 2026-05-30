"use client";

import { Search } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { semanticSearchAction } from "./semantic-search-action";
import { SemanticSearchResults } from "./semantic-search-results";

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

export function SemanticSearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { execute, result, isPending } = useAction(semanticSearchAction);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      return;
    }
    execute({ query: trimmed, scope: "both", limit: 10 });
  }, [debouncedQuery, execute]);

  const notes = result.data?.notes ?? [];
  const glossary = result.data?.glossary ?? [];

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Recherche sémantique dans tes notes et le glossaire…"
          className="pl-10"
          aria-label="Recherche sémantique"
        />
      </div>

      {result.serverError && (
        <p className="text-destructive text-sm">{result.serverError}</p>
      )}

      <SemanticSearchResults
        query={debouncedQuery}
        isPending={isPending}
        notes={notes}
        glossary={glossary}
      />
    </div>
  );
}
