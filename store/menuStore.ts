import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, menuItems as seedMenuItems } from '@/lib/menuData';

interface MenuState {
  items: MenuItem[];
  addItem: (item: MenuItem) => void;
  updateItem: (item: MenuItem) => void;
  deleteItem: (id: string) => void;
  resetToSeed: () => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      items: seedMenuItems,

      addItem: (item: MenuItem) => {
        set((state) => ({ items: [...state.items, item] }));
      },

      updateItem: (item: MenuItem) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === item.id ? item : i)),
        }));
      },

      deleteItem: (id: string) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      resetToSeed: () => set({ items: seedMenuItems }),
    }),
    {
      name: 'food-menu-storage',
    }
  )
);
