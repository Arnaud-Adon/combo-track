"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  CharacterOption,
  GameOption,
} from "../../../../prisma/query/strategy-matrix.query";

const ALL_VALUE = "__all__";

type Props = {
  games: GameOption[];
  charactersByGame: Record<string, CharacterOption[]>;
  selectedGameId?: string;
  selectedCharacterId?: string;
};

export function StrategyMatrixFilters({
  games,
  charactersByGame,
  selectedGameId,
  selectedCharacterId,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const characters = selectedGameId
    ? (charactersByGame[selectedGameId] ?? [])
    : [];

  const updateParams = (next: {
    gameId?: string;
    characterId?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.gameId) params.set("gameId", next.gameId);
    else params.delete("gameId");
    if (next.characterId) params.set("characterId", next.characterId);
    else params.delete("characterId");
    const qs = params.toString();
    router.push(`/notes/strategy${qs ? `?${qs}` : ""}`);
  };

  const handleGameChange = (raw: string) => {
    updateParams({
      gameId: raw === ALL_VALUE ? undefined : raw,
      characterId: undefined,
    });
  };

  const handleCharacterChange = (raw: string) => {
    updateParams({
      gameId: selectedGameId,
      characterId: raw === ALL_VALUE ? undefined : raw,
    });
  };

  const hasFilter = Boolean(selectedGameId || selectedCharacterId);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <label className="text-xs font-medium">Jeu</label>
        <Select
          value={selectedGameId ?? ALL_VALUE}
          onValueChange={handleGameChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les jeux</SelectItem>
            {games.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">Personnage</label>
        <Select
          value={selectedCharacterId ?? ALL_VALUE}
          onValueChange={handleCharacterChange}
          disabled={!selectedGameId || characters.length === 0}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Tous les personnages</SelectItem>
            {characters.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateParams({})}
        >
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
