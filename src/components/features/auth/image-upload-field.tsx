"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { useState, type ChangeEvent } from "react";

interface ImageUploadFieldProps {
  onFileSelect?: (file: File | null) => void;
}

export function ImageUploadField({ onFileSelect }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setPreview(null);
      onFileSelect?.(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      setPreview(null);
      onFileSelect?.(null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed");
      setPreview(null);
      onFileSelect?.(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelect?.(file);
  };

  return (
    <div className="space-y-4">
      <Label>Profile Picture (Optional)</Label>

      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          {preview && <AvatarImage src={preview} alt="Preview" />}
          <AvatarFallback>
            <Camera className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2">
          <input
            type="file"
            name="avatar"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("avatar-upload")?.click()}
            >
              <Camera className="mr-2 h-4 w-4" />
              {preview ? "Change Image" : "Choose Image"}
            </Button>
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
