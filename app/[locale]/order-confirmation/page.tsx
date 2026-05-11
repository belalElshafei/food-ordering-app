'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, MapPin, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import { useOrderStore, Order } from '@/store/orderStore';

export default function OrderConfirmationPage() {
  const t = useTranslations('orderConfirmation');
  const tMenu = useTranslations('menu');
  const tCheckout = useTranslations('checkout');
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as 'en' | 'ar';
  const orderId = searchParams.get('id');

  const { getOrderById, updateOrderStatus } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const found = getOrderById(orderId);
      if (found) {
        setOrder(found);
      } else {
        router.replace(`/${locale}`);
      }
    }
  }, [orderId, getOrderById, router, locale]);

  // Simulate order status progression
  useEffect(() => {
    if (!order || order.status === 'delivered') return;

    const sequence = [
      { status: 'preparing' as const, delay: 5000 },
      { status: 'delivery' as const, delay: 10000 },
      { status: 'delivered' as const, delay: 15000 },
    ];

    const timers = sequence.map((step) => {
      return setTimeout(() => {
        updateOrderStatus(order.id, step.status);
        setOrder((prev) => prev ? { 
          ...prev, 
          status: step.status,
          statusHistory: [...prev.statusHistory, { status: step.status, timestamp: new Date().toISOString() }]
        } : null);
      }, step.delay);
    });

    return () => timers.forEach(clearTimeout);
  }, [order?.id, updateOrderStatus]); // We only want this to run once when the order ID is available

  if (!order) return null;

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <div className="pt-24 pb-20">
        <div className="page-container max-w-4xl">
          
          {/* Success Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-card border border-charcoal-100 text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={40} className="text-green-500" />
            </motion.div>
            
            <h1 className="font-display font-bold text-4xl text-charcoal-700 mb-2">{t('title')}</h1>
            <p className="text-charcoal-500 text-lg mb-8">{t('subtitle')}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto border-t border-b border-charcoal-100 py-6">
              <div>
                <p className="text-sm text-charcoal-400 mb-1">{t('orderId')}</p>
                <p className="font-bold text-charcoal-700">#{order.id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-charcoal-400 mb-1">{t('estimatedTime')}</p>
                <p className="font-bold text-charcoal-700 flex items-center justify-center gap-1">
                  <Clock size={16} className="text-saffron-500" />
                  {t('minutes')}
                </p>
              </div>
              <div>
                <p className="text-sm text-charcoal-400 mb-1">{t('paymentMethod')}</p>
                <p className="font-bold text-charcoal-700 flex items-center justify-center gap-1">
                  {order.paymentMethod === 'online' ? <CreditCard size={16} className="text-terracotta-500"/> : <Banknote size={16} className="text-green-500"/>}
                  {order.paymentMethod === 'online' ? tCheckout('payOnline') : tCheckout('payCash')}
                </p>
              </div>
              <div>
                <p className="text-sm text-charcoal-400 mb-1">{t('totalPaid')}</p>
                <p className="font-bold text-terracotta-500">{order.total.toLocaleString()} {tMenu('currency')}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Status Tracker */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-charcoal-100 h-full">
                <h2 className="font-display font-bold text-2xl text-charcoal-700 mb-8">{t('trackOrder')}</h2>
                <OrderStatusTracker status={order.status} statusHistory={order.statusHistory} />
                
                <div className="mt-12 p-4 bg-cream-50 rounded-2xl border border-charcoal-100 flex items-start gap-4">
                  <MapPin size={24} className="text-terracotta-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-charcoal-700 mb-1">{t('deliveryAddress')}</h3>
                    <p className="text-charcoal-500 text-sm leading-relaxed">{order.address}</p>
                    {order.notes && (
                      <p className="text-charcoal-400 text-sm mt-2 italic">"{order.notes}"</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-card border border-charcoal-100">
                <h2 className="font-display font-bold text-xl text-charcoal-700 mb-6">{t('orderSummary')}</h2>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                  {order.items.map((ci) => (
                    <div key={ci.item.id} className="flex gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-charcoal-700 text-sm">
                          {ci.quantity} × {ci.item.name[locale]}
                        </p>
                      </div>
                      <p className="font-semibold text-charcoal-600 text-sm">
                        {ci.item.price * ci.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-charcoal-100">
                  <div className="flex justify-between font-bold text-lg text-charcoal-700">
                    <span>{tMenu('currency')}</span>
                    <span className="text-terracotta-500">{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-charcoal-500 hover:text-terracotta-500 font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              {t('backToMenu')}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
