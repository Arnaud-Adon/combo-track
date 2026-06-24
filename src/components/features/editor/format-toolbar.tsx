"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import {
  Bold,
  Code,
  Heading,
  Highlighter,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  prefixLines,
  replaceSelection,
  wrapSelection,
  type SelectionResult,
} from "@/lib/wrap-selection";

import { LinkPopover } from "./link-popover";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onValueChange: (next: string) => void;
  maxLength?: number;
};

export function FormatToolbar({
  textareaRef,
  value,
  onValueChange,
  maxLength,
}: Props) {
  const t = useTranslations("common.editor");
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const selectionRef = useRef({ start: 0, end: 0 });

  const getSelection = () => {
    const textarea = textareaRef.current;
    return {
      start: textarea?.selectionStart ?? value.length,
      end: textarea?.selectionEnd ?? value.length,
    };
  };

  const apply = (result: SelectionResult) => {
    onValueChange(result.value);
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      textarea?.focus();
      textarea?.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  };

  const wrap = (before: string, after: string) => {
    const { start, end } = getSelection();
    apply(wrapSelection(value, start, end, before, after, { maxLength }));
  };

  const prefix = (token: string | ((index: number) => string)) => {
    const { start, end } = getSelection();
    apply(prefixLines(value, start, end, token, { maxLength }));
  };

  const openLink = () => {
    const { start, end } = getSelection();
    selectionRef.current = { start, end };
    setLinkText(value.slice(start, end));
  };

  const insertLink = (text: string, url: string) => {
    const { start, end } = selectionRef.current;
    apply(
      replaceSelection(value, start, end, `[${text}](${url})`, { maxLength }),
    );
    setLinkOpen(false);
  };

  const ToolButton = ({
    label,
    onClick,
    children,
  }: {
    label: string;
    onClick: () => void;
    children: ReactNode;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  return (
    <div
      role="toolbar"
      aria-label={t("toolbarLabel")}
      aria-orientation="horizontal"
      className="flex flex-wrap items-center gap-0.5"
    >
      <ToolButton label={t("bold")} onClick={() => wrap("**", "**")}>
        <Bold aria-hidden />
      </ToolButton>
      <ToolButton label={t("italic")} onClick={() => wrap("_", "_")}>
        <Italic aria-hidden />
      </ToolButton>
      <ToolButton label={t("strikethrough")} onClick={() => wrap("~~", "~~")}>
        <Strikethrough aria-hidden />
      </ToolButton>
      <ToolButton label={t("highlight")} onClick={() => wrap("==", "==")}>
        <Highlighter aria-hidden />
      </ToolButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={t("heading")}
            title={t("heading")}
          >
            <Heading aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => prefix("# ")}>
            {t("heading1")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => prefix("## ")}>
            {t("heading2")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => prefix("### ")}>
            {t("heading3")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ToolButton label={t("bulletList")} onClick={() => prefix("- ")}>
        <List aria-hidden />
      </ToolButton>
      <ToolButton
        label={t("orderedList")}
        onClick={() => prefix((index) => `${index + 1}. `)}
      >
        <ListOrdered aria-hidden />
      </ToolButton>
      <ToolButton label={t("quote")} onClick={() => prefix("> ")}>
        <Quote aria-hidden />
      </ToolButton>
      <ToolButton label={t("codeBlock")} onClick={() => wrap("```\n", "\n```")}>
        <Code aria-hidden />
      </ToolButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <LinkPopover
        open={linkOpen}
        onOpenChange={setLinkOpen}
        initialText={linkText}
        onSubmit={insertLink}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={t("link")}
            title={t("link")}
            onClick={openLink}
          >
            <LinkIcon aria-hidden />
          </Button>
        }
      />
    </div>
  );
}
