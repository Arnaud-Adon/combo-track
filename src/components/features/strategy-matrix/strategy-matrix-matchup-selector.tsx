"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CharacterOption,
  GameOption,
} from "../../../../prisma/query/strategy-matrix.query";

const NONE_VALUE = "__none__";

type MatchupValue = {
  gameId?: string;
  myCharacterId?: string;
  opponentCharacterId?: string;
};

type Props = {
  games: GameOption[];
  charactersByGame: Record<string, CharacterOption[]>;
  value: MatchupValue;
  onChange: (next: MatchupValue) => void;
};

export function StrategyMatrixMatchupSelector({
  games,
  charactersByGame,
  value,
  onChange,
}: Props) {
  const characters = value.gameId ? (charactersByGame[value.gameId] ?? []) : [];

  const handleGameChange = (raw: string) => {
    const gameId = raw === NONE_VALUE ? undefined : raw;
    onChange({
      gameId,
      myCharacterId: undefined,
      opponentCharacterId: undefined,
    });
  };

  const handleCharacterChange = (
    field: "myCharacterId" | "opponentCharacterId",
    raw: string,
  ) => {
    onChange({
      ...value,
      [field]: raw === NONE_VALUE ? undefined : raw,
    });
  };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="space-y-1">
        <label className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
          Jeu
        </label>
        <Select
          value={value.gameId ?? NONE_VALUE}
          onValueChange={handleGameChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Aucun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Aucun</SelectItem>
            {games.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
          Mon personnage
        </label>
        <Select
          value={value.myCharacterId ?? NONE_VALUE}
          onValueChange={(v) => handleCharacterChange("myCharacterId", v)}
          disabled={!value.gameId || characters.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Aucun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Aucun</SelectItem>
            {characters.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
          Personnage adverse
        </label>
        <Select
          value={value.opponentCharacterId ?? NONE_VALUE}
          onValueChange={(v) => handleCharacterChange("opponentCharacterId", v)}
          disabled={!value.gameId || characters.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Aucun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>Aucun</SelectItem>
            {characters.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
