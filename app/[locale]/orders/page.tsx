'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { PackageOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import AuthGuard from '@/components/AuthGuard';
import OrderCard from '@/components/OrderCard';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function OrdersPage() {
  const t = useTranslations('orders');
  const params = useParams();
  const locale = params.locale as 'en' | 'ar';

  const { getOrdersByUser } = useOrderStore();
  const { user } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const userOrders = user ? getOrdersByUser(user.id) : [];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-cream-100">
        <Header />

        <div className="pt-24 pb-20">
          <div className="page-container max-w-4xl">
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-display font-bold text-4xl text-charcoal-700 mb-2">{t('title')}</h1>
              <p className="text-charcoal-500">{t('subtitle')}</p>
            </div>

            <AnimatePresence mode="wait">
              {userOrders.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl p-12 shadow-card border border-charcoal-100 text-center"
                >
                  <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PackageOpen size={48} className="text-charcoal-300" />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-charcoal-700 mb-2">{t('empty')}</h2>
                  <p className="text-charcoal-500 mb-8">{t('emptyDesc')}</p>
                  <Link 
                    href={`/${locale}`}
                    className="btn-primary inline-block"
                  >
                    {t('orderMenu')}
                  </Link>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-6"
                >
                  {userOrders.map((order) => (
                    <OrderCard key={order.id} order={order} locale={locale} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
