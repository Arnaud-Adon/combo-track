import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "@/components/features/auth/sign-up-form";
import { GoogleSignInButton } from "@/components/features/auth/google-sign-in-button";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: t("signUp.metadataTitle"),
  };
}

export default async function SignUpPage() {
  const t = await getTranslations("auth");

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("signUp.title")}</CardTitle>
          <CardDescription>{t("signUp.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                {t("signUp.divider")}
              </span>
            </div>
          </div>

          <GoogleSignInButton />
        </CardContent>
      </Card>
    </div>
  );
}
