import { MemoList } from "@/components/features/memo/memo-list";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getMemosByUser } from "../../../../prisma/query/memo.query";

export default async function MemoListPage() {
  const user = await requireAuth();
  const memos = await getMemosByUser({ userId: user.id });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mémos</h1>
          <p className="text-muted-foreground mt-1">
            Vos aide-mémoires personnels : notations, frame data, situations.
          </p>
        </div>
        <Button asChild>
          <Link href="/notes/memo/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau mémo
          </Link>
        </Button>
      </div>

      <MemoList memos={memos} />
    </div>
  );
}
