import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from '@/lib/menuData';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item: MenuItem) => {
        set((state) => {
          const existing = state.items.find((ci) => ci.item.id === item.id);
          if (existing) {
            return {
              items: state.items.map((ci) =>
                ci.item.id === item.id
                  ? { ...ci, quantity: ci.quantity + 1 }
                  : ci
              ),
            };
          }
          return { items: [...state.items, { item, quantity: 1 }] };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((ci) => ci.item.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((ci) =>
            ci.item.id === itemId ? { ...ci, quantity } : ci
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((sum, ci) => sum + ci.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, ci) => sum + ci.item.price * ci.quantity,
          0
        );
      },
    }),
    {
      name: 'food-cart-storage',
    }
  )
);
