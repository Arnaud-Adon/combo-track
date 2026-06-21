"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UnauthenticatedNav() {
  const t = useTranslations("landing");

  return (
    <div className="flex items-center gap-4">
      <Link href="/sign-in">
        <Button variant="outline">{t("nav.signIn")}</Button>
      </Link>
      <Link href="/sign-up">
        <Button>{t("nav.signUp")}</Button>
      </Link>
    </div>
  );
}
