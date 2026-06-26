import { useCallback, useEffect, useRef, useState } from "react";

const COALESCE_MS = 400;

type EditorHistory = {
  record: (next: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export function useEditorHistory(
  value: string,
  onChange: (next: string) => void,
): EditorHistory {
  const stackRef = useRef<string[]>([value]);
  const indexRef = useRef(0);
  const lastEditAtRef = useRef(0);
  const skipSyncRef = useRef(false);
  const [, rerender] = useState(0);
  const refresh = () => rerender((n) => n + 1);

  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    if (value === stackRef.current[indexRef.current]) return;

    stackRef.current = [
      ...stackRef.current.slice(0, indexRef.current + 1),
      value,
    ];
    indexRef.current = stackRef.current.length - 1;
    lastEditAtRef.current = 0;
    refresh();
  }, [value]);

  const record = useCallback(
    (next: string) => {
      const now = Date.now();
      const coalesce = now - lastEditAtRef.current < COALESCE_MS;
      lastEditAtRef.current = now;
      skipSyncRef.current = true;

      if (coalesce) {
        stackRef.current[indexRef.current] = next;
      } else {
        stackRef.current = [
          ...stackRef.current.slice(0, indexRef.current + 1),
          next,
        ];
        indexRef.current = stackRef.current.length - 1;
      }

      onChange(next);
      refresh();
    },
    [onChange],
  );

  const undo = useCallback(() => {
    if (indexRef.current === 0) return;
    indexRef.current -= 1;
    lastEditAtRef.current = 0;
    skipSyncRef.current = true;
    onChange(stackRef.current[indexRef.current]);
    refresh();
  }, [onChange]);

  const redo = useCallback(() => {
    if (indexRef.current >= stackRef.current.length - 1) return;
    indexRef.current += 1;
    lastEditAtRef.current = 0;
    skipSyncRef.current = true;
    onChange(stackRef.current[indexRef.current]);
    refresh();
  }, [onChange]);

  return {
    record,
    undo,
    redo,
    canUndo: indexRef.current > 0,
    canRedo: indexRef.current < stackRef.current.length - 1,
  };
}
