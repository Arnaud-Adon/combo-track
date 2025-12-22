"use client";

import { useCallback, useEffect, useRef } from "react";

import { Note, Tag } from "@/../generated/prisma";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useVideoPlayerStore } from "@/stores/video-player";
import { formatTime } from "@/utils";

type NoteWithTags = Note & { tags: Tag[] };

type NoteListProps = {
  notes: NoteWithTags[];
};

type NoteItemProps = {
  note: NoteWithTags;
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
        "w-full p-4 rounded-lg border-2 transition-all text-left shadow-sm hover:shadow-md",
        "bg-card border-border hover:border-primary/50",
        isActive && "ring-2 ring-primary border-primary bg-primary/5 shadow-lg",
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={cn(
            "px-2.5 py-1 rounded-md font-mono text-xs font-bold",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary",
          )}
        >
          {formatTime(note.timestamp)}
        </div>
      </div>
      <p className="text-sm text-black leading-relaxed font-medium">
        {note.content}
      </p>
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {note.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
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
