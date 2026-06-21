"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  published: boolean;
}

export function StatusBadge({ published }: StatusBadgeProps) {
  const t = useTranslations("admin");

  return (
    <Badge
      variant={published ? "default" : "secondary"}
      className={published ? "bg-emerald-500" : ""}
    >
      {published ? t("article.status.published") : t("article.status.draft")}
    </Badge>
  );
}
