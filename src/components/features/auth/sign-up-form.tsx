"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadAvatarAction } from "@/lib/actions/upload-avatar";
import { signUp, useSession } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpInput, signUpSchema } from "./auth-schema";
import { ImageUploadField } from "./image-upload-field";

export function SignUpForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { refetch } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(data: SignUpInput) {
    setError(null);

    const result = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
    });

    if (result.error) {
      setError(result.error.message ?? t("signUp.error"));
      return;
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      const uploadResult = await uploadAvatarAction(formData);

      if (uploadResult.success) {
        refetch();
      }
    }

    router.push("/videos");
  }

  const handleFileSelect = (file: File | null) => setSelectedFile(file);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.nameLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  autoComplete="name"
                  placeholder={t("fields.namePlaceholder")}
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showAvatarUpload && (
          <ImageUploadField onFileSelect={handleFileSelect} />
        )}

        {!showAvatarUpload && !selectedFile && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAvatarUpload(true)}
            className="w-full"
          >
            Add Profile Picture (Optional)
          </Button>
        )}

        {selectedFile && (
          <div className="text-muted-foreground text-sm">
            ✓ Profile picture selected
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  autoComplete="email"
                  placeholder={t("fields.emailPlaceholder")}
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.passwordLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.confirmPasswordLabel")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? t("signUp.submitting")
            : t("signUp.submit")}
        </Button>

        <div className="text-center text-sm">
          {t("signUp.hasAccount")}{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            {t("signUp.signInLink")}
          </Link>
        </div>
      </form>
    </Form>
  );
}
