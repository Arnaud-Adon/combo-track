import { create } from "zustand";

interface SearchDialogState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useSearchDialogStore = create<SearchDialogState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
}));
