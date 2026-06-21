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
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { StreamCard } from "./stream-card";

type StreamListProps = {
  streams: TwitchStream[];
};

const ALL_VALUE = "__all__";

const PINNED_LANGUAGES = ["fr", "de"];

const KNOWN_LANGUAGES = [
  "fr",
  "de",
  "en",
  "ja",
  "es",
  "it",
  "pt",
  "ko",
  "zh",
] as const;

type KnownLanguage = (typeof KNOWN_LANGUAGES)[number];

function isKnownLanguage(language: string): language is KnownLanguage {
  return (KNOWN_LANGUAGES as readonly string[]).includes(language);
}

export function StreamList({ streams }: StreamListProps) {
  const t = useTranslations("stream");
  const [language, setLanguage] = useState(ALL_VALUE);

  const getLanguageLabel = useCallback(
    (lang: string) =>
      isKnownLanguage(lang) ? t(`languages.${lang}`) : lang.toUpperCase(),
    [t],
  );

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
    [streams, getLanguageLabel],
  );

  const filteredStreams =
    language === ALL_VALUE
      ? streams
      : streams.filter((stream) => stream.language === language);

  if (streams.length === 0) {
    return (
      <div className="text-muted-foreground py-16 text-center">
        <Tv className="mx-auto mb-4 h-12 w-12" />
        <p className="text-lg">{t("empty.noStreams")}</p>
        <p className="mt-2 text-sm">{t("empty.noStreamsHint")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium">{t("filter.language")}</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("filter.allPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>
                {t("filter.allLanguages")}
              </SelectItem>
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
          <p className="text-lg">{t("empty.noStreamsForLanguage")}</p>
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
