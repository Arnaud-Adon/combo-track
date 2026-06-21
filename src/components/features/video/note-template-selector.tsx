"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardList } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  NOTE_TEMPLATE_CATEGORIES,
  NOTE_TEMPLATES,
  NoteTemplate,
} from "./note-templates";

const CATEGORY_COLORS: Record<
  (typeof NOTE_TEMPLATE_CATEGORIES)[number],
  string
> = {
  Offense: "bg-tag-offense/15 text-tag-offense",
  Defense: "bg-tag-defense/15 text-tag-defense",
  Neutral: "bg-tag-neutral/15 text-tag-neutral",
  Mental: "bg-tag-mental/15 text-tag-mental",
  Execution: "bg-tag-execution/15 text-tag-execution",
  Okizeme: "bg-tag-okizeme/15 text-tag-okizeme",
};

type NoteTemplateSelectorProps = {
  onSelect: (template: NoteTemplate) => void;
};

export function NoteTemplateSelector({ onSelect }: NoteTemplateSelectorProps) {
  const t = useTranslations("video.templateSelector");
  const tTemplates = useTranslations("video.noteTemplates");

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label={t("label")}
            >
              <ClipboardList className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("label")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
        {NOTE_TEMPLATE_CATEGORIES.map((category, index) => (
          <div key={category}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel
              className={`mx-1 rounded-sm px-2 ${CATEGORY_COLORS[category]}`}
            >
              {category}
            </DropdownMenuLabel>
            {NOTE_TEMPLATES.filter(
              (template) => template.category === category,
            ).map((template) => (
              <DropdownMenuItem
                key={template.id}
                onClick={() =>
                  onSelect({
                    ...template,
                    content: tTemplates(
                      template.id as Parameters<typeof tTemplates.has>[0],
                    ),
                  })
                }
              >
                {template.name}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
