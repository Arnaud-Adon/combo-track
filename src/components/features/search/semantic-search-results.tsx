"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { GlossarySearchResult } from "@/lib/rag/search-glossary";
import type { MemoSearchResult } from "@/lib/rag/search-memos";
import type { NoteSearchResult } from "@/lib/rag/search-notes";
import { formatTime } from "@/utils";

type SemanticSearchResultsProps = {
  query: string;
  isPending: boolean;
  notes: NoteSearchResult[];
  glossary: GlossarySearchResult[];
  memos: MemoSearchResult[];
  onResultClick?: () => void;
};

function SimilarityBadge({ similarity }: { similarity: number }) {
  return (
    <Badge variant="outline" className="font-mono text-xs">
      {Math.round(similarity * 100)}%
    </Badge>
  );
}

export function SemanticSearchResults(props: SemanticSearchResultsProps) {
  const { query, isPending, notes, glossary, memos, onResultClick } = props;
  const t = useTranslations("search");

  if (query.trim().length < 2) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        {t("results.minLength")}
      </p>
    );
  }

  if (isPending) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        {t("results.pending")}
      </p>
    );
  }

  const hasResults =
    notes.length > 0 || glossary.length > 0 || memos.length > 0;
  if (!hasResults) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        {t("results.empty", { query })}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {notes.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">{t("results.notes")}</h2>
          <ul className="space-y-2">
            {notes.map((note) => (
              <li key={note.id}>
                <Link
                  href={`/videos/${note.matchId}#t=${note.timestamp}`}
                  onClick={onResultClick}
                  className="bg-card hover:border-primary/50 block rounded-lg border-2 p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary rounded-md px-2.5 py-1 font-mono text-xs font-bold">
                        {formatTime(note.timestamp)}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {note.matchTitle}
                      </span>
                    </div>
                    <SimilarityBadge similarity={note.similarity} />
                  </div>
                  <p className="text-sm leading-relaxed">{note.content}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {memos.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">{t("results.memos")}</h2>
          <ul className="space-y-2">
            {memos.map((memo) => (
              <li key={memo.id}>
                <Link
                  href={`/notes/memo/${memo.id}`}
                  onClick={onResultClick}
                  className="bg-card hover:border-primary/50 block rounded-lg border-2 p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-semibold">{memo.title}</span>
                    <SimilarityBadge similarity={memo.similarity} />
                  </div>
                  {memo.content && (
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed whitespace-pre-wrap">
                      {memo.content}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {glossary.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">
            {t("results.glossary")}
          </h2>
          <ul className="space-y-2">
            {glossary.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/glossary/${article.slug}`}
                  onClick={onResultClick}
                  className="bg-card hover:border-primary/50 block rounded-lg border-2 p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{article.title}</span>
                      {article.category && (
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                      )}
                    </div>
                    <SimilarityBadge similarity={article.similarity} />
                  </div>
                  {article.excerpt && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
