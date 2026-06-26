"use client";

import { MarkdownPreview } from "@/components/features/notation/markdown-preview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  title: string;
  content: string;
};

export function MemoVisualizeDialog({ title, content }: Props) {
  const t = useTranslations("memo");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("visualize.trigger")}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("visualize.trigger")}</TooltipContent>
      </Tooltip>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content ? (
          <MarkdownPreview className="space-y-4 leading-relaxed [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:leading-relaxed">
            {content}
          </MarkdownPreview>
        ) : (
          <p className="text-muted-foreground text-sm">
            {t("visualize.emptyContent")}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
