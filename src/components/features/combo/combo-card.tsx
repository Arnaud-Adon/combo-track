import Link from "next/link";
import { Gauge, Heart, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComboListItem } from "@/../prisma/query/combo.query";
import { formatDate } from "@/utils";

interface ComboCardProps {
  combo: ComboListItem;
}

export function ComboCard({ combo }: ComboCardProps) {
  return (
    <Link href={`/combos/${combo.id}`}>
      <Card className="border-border bg-card/50 hover:border-primary/40 hover:bg-card h-full cursor-pointer rounded-xl border border-l-2 border-l-transparent backdrop-blur transition-all hover:-translate-y-0.5 hover:border-l-primary hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg">{combo.title}</CardTitle>
            <div className="text-muted-foreground shrink-0 font-mono text-xs">
              {formatDate(combo.createdAt)}
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
            <span className="text-foreground font-medium">
              {combo.character.name}
            </span>
            <span className="text-primary">·</span>
            <span>{combo.character.game.name}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <code className="bg-muted block rounded-md px-3 py-2 font-mono text-sm break-words">
            {combo.notation}
          </code>
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
            {combo.damage != null && (
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {combo.damage}
              </span>
            )}
            {combo.meterUsed != null && (
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" />
                {combo.meterUsed}
              </span>
            )}
            {combo.difficulty != null && (
              <span className="flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5" />
                {combo.difficulty}/5
              </span>
            )}
          </div>
          {combo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {combo.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
