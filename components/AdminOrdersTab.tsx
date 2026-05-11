'use client';

import { useTranslations } from 'next-intl';
import { useOrderStore, OrderStatus } from '@/store/orderStore';
import { Package } from 'lucide-react';

export default function AdminOrdersTab({ locale }: { locale: 'en' | 'ar' }) {
  const t = useTranslations('admin');
  const tStatus = useTranslations('status');
  const tMenu = useTranslations('menu');
  const tCheckout = useTranslations('checkout');
  const { orders, updateOrderStatus } = useOrderStore();

  const STATUS_OPTIONS: OrderStatus[] = ['received', 'preparing', 'delivery', 'delivered'];

  const STATUS_COLORS: Record<OrderStatus, string> = {
    received: 'bg-blue-100 text-blue-700',
    preparing: 'bg-yellow-100 text-yellow-700',
    delivery: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-charcoal-700 mb-6">{t('orders')}</h2>

      <div className="bg-white rounded-2xl shadow-card border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-cream-50 border-b border-charcoal-100 text-charcoal-500 text-sm font-semibold">
                <th className="p-4">ID</th>
                <th className="p-4">{t('customer')}</th>
                <th className="p-4">{t('payment')}</th>
                <th className="p-4">{t('time')}</th>
                <th className="p-4">{t('price')}</th>
                <th className="p-4 text-end">{t('updateStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-charcoal-400">
                    <div className="flex flex-col items-center justify-center">
                      <Package size={32} className="mb-2 opacity-50" />
                      <p>{t('noOrders')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-charcoal-100 hover:bg-cream-50 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-charcoal-700 text-sm">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-charcoal-700 text-sm">{order.customerName}</p>
                      <p className="text-xs text-charcoal-400">{order.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold bg-cream-200 text-charcoal-600 px-2 py-1 rounded-md">
                        {order.paymentMethod === 'online' ? tCheckout('payOnline') : tCheckout('payCash')}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-charcoal-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-charcoal-400 font-semibold">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="p-4 font-semibold text-terracotta-500">
                      {order.total.toLocaleString()} {tMenu('currency')}
                    </td>
                    <td className="p-4 text-end">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-sm font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer outline-none ${STATUS_COLORS[order.status]}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status} className="bg-white text-charcoal-700">
                            {tStatus(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
