"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const urlSchema = z.string().url();

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialText: string;
  onSubmit: (text: string, url: string) => void;
  trigger: ReactNode;
};

export function LinkPopover({
  open,
  onOpenChange,
  initialText,
  onSubmit,
  trigger,
}: Props) {
  const t = useTranslations("common.editor");
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (open) {
      setText(initialText);
      setUrl("");
      setInvalid(false);
    }
  }, [open, initialText]);

  const submit = () => {
    if (!urlSchema.safeParse(url).success) {
      setInvalid(true);
      return;
    }
    onSubmit(text.trim() || url, url);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-72 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="rme-link-text" className="text-xs">
            {t("linkText")}
          </Label>
          <Input
            id="rme-link-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("linkTextPlaceholder")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rme-link-url" className="text-xs">
            {t("linkUrl")}
          </Label>
          <Input
            id="rme-link-url"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setInvalid(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="https://…"
            aria-invalid={invalid}
          />
          {invalid && (
            <p className="text-destructive text-xs">{t("linkUrlInvalid")}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {t("linkCancel")}
          </Button>
          <Button type="button" size="sm" onClick={submit}>
            {t("linkInsert")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
