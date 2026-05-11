'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

const DELIVERY_FEE = 25;

export default function CartDrawer() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === 'ar';

  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 200 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="overlay z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 end-0 h-full w-full max-w-[420px] bg-cream-50 shadow-warm-lg z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-200 bg-charcoal-700">
              <h2 className="font-display font-bold text-xl text-cream-100">
                {t('cart.title')}
              </h2>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-cream-200 hover:bg-white/20 hover:text-cream-100 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center gap-4 text-center py-16"
                  >
                    <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center">
                      <ShoppingBag size={36} className="text-charcoal-300" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-semibold text-charcoal-600">{t('cart.empty')}</p>
                      <p className="text-charcoal-400 text-sm mt-1">{t('cart.emptyDesc')}</p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="btn-secondary mt-2 py-2 px-5 text-sm"
                    >
                      {t('cart.continueShopping')}
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {items.map((ci) => (
                      <motion.div
                        key={ci.item.id}
                        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isRTL ? -20 : 20, height: 0, marginBottom: 0 }}
                        layout
                        className="flex gap-3 bg-white rounded-2xl p-3 shadow-card"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={ci.item.image}
                            alt={ci.item.name[locale as 'en' | 'ar']}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-charcoal-700 text-sm leading-tight truncate">
                            {ci.item.name[locale as 'en' | 'ar']}
                          </p>
                          <p className="text-terracotta-500 font-bold text-sm mt-0.5">
                            {(ci.item.price * ci.quantity).toLocaleString()} {t('menu.currency')}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-cream-200 flex items-center justify-center text-charcoal-600 hover:bg-terracotta-500 hover:text-white transition-all text-sm font-bold"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-bold text-charcoal-700 text-sm w-5 text-center">
                              {ci.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-cream-200 flex items-center justify-center text-charcoal-600 hover:bg-terracotta-500 hover:text-white transition-all text-sm font-bold"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(ci.item.id)}
                          className="self-start w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
                          aria-label={t('cart.remove')}
                        >
                          <Trash2 size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-charcoal-200 bg-white space-y-3">
                <div className="flex justify-between text-sm text-charcoal-500">
                  <span>{t('cart.subtotal')}</span>
                  <span>{subtotal.toLocaleString()} {t('menu.currency')}</span>
                </div>
                <div className="flex justify-between text-sm text-charcoal-500">
                  <span>{t('cart.delivery')}</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                    {deliveryFee === 0 ? t('cart.free') : `${deliveryFee} ${t('menu.currency')}`}
                  </span>
                </div>
                <div className="divider !my-0" />
                <div className="flex justify-between font-bold text-charcoal-700">
                  <span className="font-display">{t('cart.total')}</span>
                  <span className="text-terracotta-500 text-lg">{total.toLocaleString()} {t('menu.currency')}</span>
                </div>

                <Link
                  href={`/${locale}/checkout`}
                  onClick={closeCart}
                  className="btn-primary w-full text-center block mt-2"
                >
                  {t('cart.checkout')}
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-charcoal-400 hover:text-terracotta-500 transition-colors py-1"
                >
                  {t('cart.continueShopping')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
