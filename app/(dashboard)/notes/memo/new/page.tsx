import { MemoForm } from "@/components/features/memo/memo-form";
import { requireAuth } from "@/lib/auth-utils";

export default async function NewMemoPage() {
  await requireAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold">Nouveau mémo</h1>
        <p className="text-muted-foreground mt-1">
          Notez une stratégie, un punish, une combinaison.
        </p>
      </div>

      <MemoForm mode="create" />
    </div>
  );
}
