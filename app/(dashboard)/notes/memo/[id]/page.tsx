import { MemoForm } from "@/components/features/memo/memo-form";
import { requireAuth } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { getMemoById } from "../../../../../prisma/query/memo.query";

export default async function MemoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;

  const memo = await getMemoById({ id, userId: user.id });

  if (!memo) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Modifier le mémo</h1>
        <p className="text-muted-foreground mt-1">
          Mis à jour le{" "}
          {new Date(memo.updatedAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <MemoForm
        mode="edit"
        memoId={memo.id}
        initialData={{ title: memo.title, content: memo.content }}
      />
    </div>
  );
}
