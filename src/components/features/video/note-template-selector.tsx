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
import {
  NOTE_TEMPLATE_CATEGORIES,
  NOTE_TEMPLATES,
  NoteTemplate,
} from "./note-templates";

const CATEGORY_COLORS: Record<
  (typeof NOTE_TEMPLATE_CATEGORIES)[number],
  string
> = {
  Offense: "bg-red-500/15 text-red-700 dark:text-red-400",
  Defense: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Neutral: "bg-green-500/15 text-green-700 dark:text-green-400",
  Mental: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  Execution: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  Okizeme: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
};

type NoteTemplateSelectorProps = {
  onSelect: (template: NoteTemplate) => void;
};

export function NoteTemplateSelector({ onSelect }: NoteTemplateSelectorProps) {
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
              aria-label="Utiliser un modèle de note"
            >
              <ClipboardList className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Utiliser un modèle de note</TooltipContent>
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
            {NOTE_TEMPLATES.filter((t) => t.category === category).map(
              (template) => (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => onSelect(template)}
                >
                  {template.name}
                </DropdownMenuItem>
              ),
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
