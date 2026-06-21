import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

export default async function ComboNotFound() {
  const t = await getTranslations("combo");

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold font-display">
        {t("pages.notFoundTitle")}
      </h1>
      <p className="text-muted-foreground mt-2">
        {t("pages.notFoundDescription")}
      </p>
      <Button asChild className="mt-6">
        <Link href="/combos">{t("pages.notFoundCta")}</Link>
      </Button>
    </div>
  );
}
