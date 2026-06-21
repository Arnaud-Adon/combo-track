import { MemoForm } from "@/components/features/memo/memo-form";
import { requireAuth } from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";

export default async function NewMemoPage() {
  await requireAuth();
  const t = await getTranslations("memo");

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold font-display">
          {t("pages.newTitle")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("pages.newSubtitle")}</p>
      </div>

      <MemoForm mode="create" />
    </div>
  );
}
