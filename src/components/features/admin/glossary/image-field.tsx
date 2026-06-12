"use client";

import { ImageIcon, Loader2, X } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadGlossaryImageAction } from "@/lib/actions/upload-glossary-image";

interface ImageFieldProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImageField({ value, onChange }: ImageFieldProps) {
  const [isUploading, setIsUploading] = useState(false);

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

    onChange(result.imageUrl);
  };

  return (
    <div className="space-y-3">
      <div className="bg-muted border-border relative aspect-[16/9] w-full overflow-hidden rounded-lg border">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Aperçu"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ImageIcon className="h-8 w-8" />
            <span className="text-sm">Aucune image</span>
          </div>
        )}

        {value && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={() => onChange("")}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          id="glossary-image-upload"
          disabled={isUploading}
        />
        <label htmlFor="glossary-image-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() =>
              document.getElementById("glossary-image-upload")?.click()
            }
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="mr-2 h-4 w-4" />
            )}
            {value ? "Changer l'image" : "Choisir une image"}
          </Button>
        </label>
      </div>
    </div>
  );
}
