"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TwitchStream } from "@/lib/twitch";
import { Tv } from "lucide-react";
import { useMemo, useState } from "react";
import { StreamCard } from "./stream-card";

type StreamListProps = {
  streams: TwitchStream[];
};

const ALL_VALUE = "__all__";

const PINNED_LANGUAGES = ["fr", "de"];

const LANGUAGE_LABELS: Record<string, string> = {
  fr: "Français",
  de: "Allemand",
  en: "Anglais",
  ja: "Japonais",
  es: "Espagnol",
  it: "Italien",
  pt: "Portugais",
  ko: "Coréen",
  zh: "Chinois",
};

function getLanguageLabel(language: string): string {
  return LANGUAGE_LABELS[language] ?? language.toUpperCase();
}

export function StreamList({ streams }: StreamListProps) {
  const [language, setLanguage] = useState(ALL_VALUE);

  const languages = useMemo(
    () =>
      Array.from(
        new Set([
          ...PINNED_LANGUAGES,
          ...streams.map((stream) => stream.language),
        ]),
      )
        .filter(Boolean)
        .sort((a, b) => getLanguageLabel(a).localeCompare(getLanguageLabel(b))),
    [streams],
  );

  const filteredStreams =
    language === ALL_VALUE
      ? streams
      : streams.filter((stream) => stream.language === language);

  if (streams.length === 0) {
    return (
      <div className="text-muted-foreground py-16 text-center">
        <Tv className="mx-auto mb-4 h-12 w-12" />
        <p className="text-lg">Aucun stream Street Fighter 6 en direct.</p>
        <p className="mt-2 text-sm">
          Revenez plus tard pour regarder des streams en direct !
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">Langue</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>Toutes les langues</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredStreams.length === 0 ? (
        <div className="text-muted-foreground py-16 text-center">
          <Tv className="mx-auto mb-4 h-12 w-12" />
          <p className="text-lg">Aucun stream dans cette langue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      )}
    </div>
  );
}
