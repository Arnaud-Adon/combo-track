import Link from "next/link";
import { Gauge, Heart, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComboListItem } from "@/../prisma/query/combo.query";

interface ComboCardProps {
  combo: ComboListItem;
}

export function ComboCard({ combo }: ComboCardProps) {
  return (
    <Link href={`/combos/${combo.id}`}>
      <Card className="border-border bg-card/50 hover:border-border/80 hover:bg-card cursor-pointer rounded-xl border backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg">{combo.title}</CardTitle>
            <div className="text-muted-foreground text-xs">
              {new Date(combo.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span className="font-medium">{combo.character.name}</span>
            <span>•</span>
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
