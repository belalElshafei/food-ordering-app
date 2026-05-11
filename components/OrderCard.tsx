'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, ChevronUp, MapPin, CreditCard, Banknote } from 'lucide-react';
import { Order, OrderStatus } from '@/store/orderStore';
import OrderStatusTracker from './OrderStatusTracker';

const STATUS_COLORS: Record<OrderStatus, string> = {
  received: 'bg-blue-100 text-blue-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

interface OrderCardProps {
  order: Order;
  locale: 'en' | 'ar';
}

export default function OrderCard({ order, locale }: OrderCardProps) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState(false);

  const itemsSummary = order.items
    .map((ci) => `${ci.quantity}× ${ci.item.name[locale]}`)
    .join(', ');

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl shadow-card overflow-hidden border border-charcoal-100"
    >
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-bold text-charcoal-700 text-sm">
                #{order.id.slice(-8).toUpperCase()}
              </span>
              <span className={`status-badge ${STATUS_COLORS[order.status]}`}>
                {t(`orders.statusBadge.${order.status}`)}
              </span>
            </div>
            <p className="text-charcoal-400 text-xs mt-1">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-end flex-shrink-0">
            <p className="font-bold text-terracotta-500 text-lg">
              {order.total.toLocaleString()} {t('menu.currency')}
            </p>
          </div>
        </div>

        {/* Items Summary */}
        <p className="text-charcoal-500 text-sm mt-3 line-clamp-1">{itemsSummary}</p>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-terracotta-500 text-sm font-semibold mt-3 hover:text-terracotta-600 transition-colors"
        >
          {expanded ? (
            <><ChevronUp size={15} /> {t('orders.hideDetails')}</>
          ) : (
            <><ChevronDown size={15} /> {t('orders.viewDetails')}</>
          )}
        </button>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-charcoal-100 px-5 pb-5 pt-4 space-y-5">
              {/* Status Tracker */}
              <OrderStatusTracker status={order.status} statusHistory={order.statusHistory} />

              {/* Items List */}
              <div className="space-y-2">
                {order.items.map((ci) => (
                  <div key={ci.item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={ci.item.image} alt={ci.item.name[locale]} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal-700">{ci.item.name[locale]}</p>
                      <p className="text-xs text-charcoal-400">{ci.quantity}× {ci.item.price} {t('menu.currency')}</p>
                    </div>
                    <p className="text-sm font-semibold text-charcoal-600">
                      {(ci.item.price * ci.quantity).toLocaleString()} {t('menu.currency')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-charcoal-100">
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-terracotta-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-charcoal-400">{t('orders.deliveryAddress')}</p>
                    <p className="text-sm text-charcoal-600">{order.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {order.paymentMethod === 'online' ? (
                    <CreditCard size={15} className="text-terracotta-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Banknote size={15} className="text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs text-charcoal-400">{t('orders.paymentMethod')}</p>
                    <p className="text-sm text-charcoal-600">
                      {order.paymentMethod === 'online' ? t('checkout.payOnline') : t('checkout.payCash')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
