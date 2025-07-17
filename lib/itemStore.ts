// /lib/itemsStore.ts
import { create } from 'zustand';

type Item = { id: string; name: string };

export const useItemsStore = create<{
  items: Item[];
  setItems: (newItems: Item[]) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
}>((set) => ({
  items: [],
  setItems: (newItems) => set({ items: newItems }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
