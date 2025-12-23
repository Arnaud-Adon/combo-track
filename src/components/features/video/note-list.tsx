"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import { Note, Tag } from "@/../generated/prisma";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useVideoPlayerStore } from "@/stores/video-player";
import { formatTime } from "@/utils";
import { deleteNoteAction } from "./note-action";

type NoteWithTags = Note & { tags: Tag[] };

type NoteListProps = {
  notes: NoteWithTags[];
};

type NoteItemProps = {
  note: NoteWithTags;
  isActive: boolean;
  onClick: (timestamp: number) => void;
  onDelete: (note: NoteWithTags) => void;
};

function NoteItem({ note, isActive, onClick, onDelete }: NoteItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isActive]);

  return (
    <div
      ref={ref}
      onClick={() => onClick(note.timestamp)}
      className={cn(
        "w-full p-4 rounded-lg border-2 transition-all shadow-sm hover:shadow-md",
        "bg-card border-border hover:border-primary/50",
        isActive && "ring-2 ring-primary border-primary bg-primary/5 shadow-lg"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div
          className={cn(
            "px-2.5 py-1 rounded-md font-mono text-xs font-bold",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary"
          )}
          aria-label={`Aller à ${formatTime(note.timestamp)}`}
        >
          {formatTime(note.timestamp)}
        </div>
        <button
          type="button"
          onClick={() => onDelete(note)}
          className="p-1.5 rounded-md transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Supprimer la note"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Supprimer la note</span>
        </button>
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
    </div>
  );
}

export function NoteList(props: NoteListProps) {
  const { notes } = props;
  const router = useRouter();
  const seekToTimestamp = useVideoPlayerStore((state) => state.seekToTimestamp);
  const currentTime = useVideoPlayerStore((state) => state.currentTime);

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    note: NoteWithTags | null;
  }>({
    open: false,
    note: null,
  });

  const { execute, isPending, result } = useAction(deleteNoteAction, {
    onSuccess: () => {
      setDeleteDialog({ open: false, note: null });
      router.refresh();
    },
  });

  const handleNoteClick = useCallback(
    (timestamp: number) => {
      seekToTimestamp(timestamp);
    },
    [seekToTimestamp]
  );

  const openDeleteDialog = (note: NoteWithTags) => {
    setDeleteDialog({ open: true, note });
  };

  const handleDelete = () => {
    if (deleteDialog.note) {
      execute({ noteId: deleteDialog.note.id });
    }
  };

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
    <>
      <div className="space-y-3">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            isActive={note.id === activeNoteId}
            onClick={handleNoteClick}
            onDelete={openDeleteDialog}
          />
        ))}
      </div>

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, note: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Voulez-vous supprimer cette note ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.note?.content}
              <br />
              <br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
          {result.serverError && (
            <p className="text-sm text-destructive mt-2">
              {result.serverError}
            </p>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
