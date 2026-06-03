import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils";
import Link from "next/link";
import { RecentStrategyMatrices } from "../../../../prisma/query/strategy-matrix.query";

interface StrategyMatrixCardProps {
  matrix: RecentStrategyMatrices[number];
}

export function StrategyMatrixCard({ matrix }: StrategyMatrixCardProps) {
  const hasMatchup = matrix.myCharacter ?? matrix.opponentCharacter;

  return (
    <Link href={`/notes/strategy/${matrix.id}`} className="block">
      <Card className="text-muted-foreground border-border bg-card/50 hover:border-primary/40 hover:bg-card cursor-pointer rounded-xl border border-l-2 border-l-transparent px-1 py-4 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-l-primary hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {matrix.game && (
                <Badge
                  className="border-border bg-secondary text-muted-foreground border font-mono"
                  variant="outline"
                >
                  {matrix.game.name}
                </Badge>
              )}
              <span className="text-foreground truncate text-lg">
                {matrix.title}
              </span>
            </div>
            <div className="text-muted-foreground shrink-0 font-mono text-xs">
              {formatDate(matrix.createdAt)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-mono">
              {matrix.myCharacter && <span>{matrix.myCharacter.name}</span>}
              {matrix.myCharacter && matrix.opponentCharacter && (
                <span className="text-primary">vs</span>
              )}
              {matrix.opponentCharacter && (
                <span>{matrix.opponentCharacter.name}</span>
              )}
              {!hasMatchup && (
                <span className="text-muted-foreground/60">—</span>
              )}
            </div>
            <p className="font-mono text-xs">
              {matrix.filledCellCount} cellule
              {matrix.filledCellCount > 1 ? "s" : ""}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
