import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';

export type OrderStatus = 'received' | 'preparing' | 'delivery' | 'delivered';
export type PaymentMethod = 'online' | 'cash';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  statusHistory: { status: OrderStatus; timestamp: string }[];
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByUser: (userId: string) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (order: Order) => {
        set((state) => ({ orders: [order, ...state.orders] }));
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  statusHistory: [
                    ...o.statusHistory,
                    { status, timestamp: new Date().toISOString() },
                  ],
                }
              : o
          ),
        }));
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((o) => o.id === orderId);
      },

      getOrdersByUser: (userId: string) => {
        return get().orders.filter((o) => o.userId === userId);
      },
    }),
    {
      name: 'food-orders-storage',
    }
  )
);
