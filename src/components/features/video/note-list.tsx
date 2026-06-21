"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import Link from "next/link";
import { Swords, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useTranslations } from "next-intl";

import { Note, Tag } from "@/../generated/prisma";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
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
  const t = useTranslations("video.noteList");
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
        "group bg-card border-border hover:border-primary/40 w-full cursor-pointer rounded-xl border border-l-2 border-l-transparent p-4 transition-all hover:shadow-md",
        isActive && "border-primary/40 border-l-primary bg-accent shadow-md",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div
          className={cn(
            "rounded-md px-2.5 py-1 font-mono text-xs font-bold tabular-nums",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-primary",
          )}
          aria-label={t("seekTo", { time: formatTime(note.timestamp) })}
        >
          {formatTime(note.timestamp)}
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/combos/new?fromNote=${note.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:bg-accent hover:text-primary rounded-md p-1.5 transition-colors"
            aria-label={t("extractToCombo")}
          >
            <Swords className="h-4 w-4" />
            <span className="sr-only">{t("extractToCombo")}</span>
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note);
            }}
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md p-1.5 transition-colors"
            aria-label={t("deleteNote")}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t("deleteNote")}</span>
          </button>
        </div>
      </div>
      <p className="text-foreground text-sm leading-relaxed">{note.content}</p>
      {note.tags && note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="font-mono text-xs"
            >
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
  const t = useTranslations("video.noteList");
  const tCommon = useTranslations("common.buttons");
  const seekToTimestamp = useVideoPlayerStore((state) => state.seekToTimestamp);
  const currentTime = useVideoPlayerStore((state) => state.currentTime);

  const deleteDialog = useDeleteDialog<NoteWithTags>();

  const { execute, isPending, result } = useAction(deleteNoteAction, {
    onSuccess: () => {
      deleteDialog.close();
      router.refresh();
    },
  });

  const handleNoteClick = useCallback(
    (timestamp: number) => {
      seekToTimestamp(timestamp);
    },
    [seekToTimestamp],
  );

  const handleDelete = () => {
    if (deleteDialog.item) {
      execute({ noteId: deleteDialog.item.id });
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
      <div className="border-border text-muted-foreground flex flex-col items-center gap-2 rounded-xl border border-dashed py-10 text-center">
        <p className="font-mono text-sm">{t("empty")}</p>
        <p className="text-sm">{t("emptyHint")}</p>
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
            onDelete={deleteDialog.openWith}
          />
        ))}
      </div>

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title={t("deleteTitle")}
        description={t("deleteIrreversible")}
        itemName={deleteDialog.item?.content}
        isPending={isPending}
        onConfirm={handleDelete}
        confirmLabel={tCommon("delete")}
        cancelLabel={tCommon("cancel")}
        deletingLabel={t("deleting")}
        serverError={result.serverError}
      />
    </>
  );
}
