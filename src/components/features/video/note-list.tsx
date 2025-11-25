"use client";

import { useCallback, useEffect, useRef } from "react";

import { Note } from "@/../generated/prisma";
import { cn } from "@/lib/utils";
import { useVideoPlayerStore } from "@/stores/video-player";
import { formatTime } from "@/utils";

type NoteListProps = {
  notes: Note[];
};

type NoteItemProps = {
  note: Note;
  isActive: boolean;
  onClick: (timestamp: number) => void;
};

function NoteItem({ note, isActive, onClick }: NoteItemProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isActive]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onClick(note.timestamp)}
      className={cn(
        "w-full p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors text-left",
        isActive && "ring-2 ring-primary bg-primary/10",
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono font-semibold text-primary">
          {formatTime(note.timestamp)}
        </span>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
    </button>
  );
}

export function NoteList(props: NoteListProps) {
  const { notes } = props;
  const seekToTimestamp = useVideoPlayerStore((state) => state.seekToTimestamp);
  const currentTime = useVideoPlayerStore((state) => state.currentTime);

  const handleNoteClick = useCallback(
    (timestamp: number) => {
      seekToTimestamp(timestamp);
    },
    [seekToTimestamp],
  );

  const activeNoteId = notes.find((note, index) => {
    const nextNote = notes[index + 1];
    if (nextNote) {
      return note.timestamp <= currentTime && currentTime < nextNote.timestamp;
    }
    return currentTime >= note.timestamp && currentTime < note.timestamp + 5;
  })?.id;

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune note de disponible pour cette vidéo
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isActive={note.id === activeNoteId}
          onClick={handleNoteClick}
        />
      ))}
    </div>
  );
}
