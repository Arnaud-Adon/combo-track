"use client";

import { ImageIcon, Loader2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { NotationToolbar } from "@/components/features/notation/notation-toolbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uploadGlossaryImageAction } from "@/lib/actions/upload-glossary-image";

interface ContentFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ContentField({ value, onChange }: ContentFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;

    if (!textarea) {
      onChange(value + text);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const newValue = before + text + after;

    onChange(newValue);

    const newCursorPos = start + text.length;

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image doit faire moins de 2 Mo");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Formats acceptés : JPEG, PNG, WebP");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    const result = await uploadGlossaryImageAction(formData);

    setIsUploading(false);

    if (!result.success || !result.imageUrl) {
      toast.error(result.error ?? "Échec de l'upload de l'image");
      return;
    }

    const alt = file.name.replace(/\.[^.]+$/, "");
    insertAtCursor(`\n\n![${alt}](${result.imageUrl})\n\n`);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <NotationToolbar
          textareaRef={textareaRef}
          value={value}
          onValueChange={onChange}
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          id="glossary-content-image-upload"
          disabled={isUploading}
        />
        <label htmlFor="glossary-content-image-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() =>
              document.getElementById("glossary-content-image-upload")?.click()
            }
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="mr-2 h-4 w-4" />
            )}
            Insérer une image
          </Button>
        </label>
      </div>

      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Contenu de l'article en markdown..."
        className="min-h-[300px] font-mono"
      />
    </div>
  );
}
