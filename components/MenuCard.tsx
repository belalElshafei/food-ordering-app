'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Plus, Minus, Eye, ShoppingCart, X } from 'lucide-react';
import { MenuItem } from '@/lib/menuData';
import { useCartStore } from '@/store/cartStore';

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export default function MenuCard({ item, index }: MenuCardProps) {
  const t = useTranslations();
  const tMenu = useTranslations('menu');
  const params = useParams();
  const locale = params.locale as 'en' | 'ar';

  const { items, addItem, updateQuantity } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = items.find((ci) => ci.item.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    addItem(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.07 }}
        className="menu-card group cursor-pointer bg-white"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={item.image}
            alt={item.name[locale]}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Quick View Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 text-charcoal-700 text-sm font-medium shadow-warm">
              <Eye size={15} />
              {t('menu.quickView')}
            </div>
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 end-3 bg-charcoal-700/80 backdrop-blur-sm rounded-lg px-2.5 py-1">
            <span className="text-saffron-400 font-bold text-sm">
              {item.price} {t('menu.currency')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-charcoal-700 text-base leading-tight mb-1">
            {item.name[locale]}
          </h3>
          <p className="text-charcoal-400 text-xs leading-relaxed line-clamp-2">
            {item.description[locale]}
          </p>

          {/* Add to Cart */}
          <div className="mt-4 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            {quantity === 0 ? (
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  justAdded
                    ? 'bg-green-500 text-white'
                    : 'bg-terracotta-500 hover:bg-terracotta-600 text-cream-100'
                }`}
              >
                <ShoppingCart size={14} />
                {justAdded ? t('menu.added') : t('menu.addToCart')}
              </motion.button>
            ) : (
              <div className="flex items-center gap-3 bg-cream-200 rounded-xl px-2 py-1.5">
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-terracotta-500 hover:bg-terracotta-500 hover:text-white transition-all"
                >
                  <Minus size={13} />
                </button>
                <span className="font-bold text-charcoal-700 w-5 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => addItem(item)}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-terracotta-500 hover:bg-terracotta-500 hover:text-white transition-all"
                >
                  <Plus size={13} />
                </button>
              </div>
            )}

            <span className="text-xs text-charcoal-300 font-medium capitalize bg-cream-200 px-2.5 py-1 rounded-lg">
              {tMenu(`categories.${item.category}`)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="overlay"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className="bg-white rounded-3xl overflow-hidden shadow-warm-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-64">
                  <Image src={item.image} alt={item.name[locale]} fill className="object-cover" />
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 end-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-charcoal-600 hover:bg-white transition-all shadow-card"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-4 start-4 bg-charcoal-700/80 backdrop-blur-sm rounded-xl px-3 py-1.5">
                    <span className="text-saffron-400 font-bold text-lg">
                      {item.price} {t('menu.currency')}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="font-display font-bold text-xl text-charcoal-700 leading-tight">
                      {item.name[locale]}
                    </h2>
                    <span className="text-xs text-charcoal-400 font-medium capitalize bg-cream-200 px-2.5 py-1 rounded-lg flex-shrink-0">
                      {tMenu(`categories.${item.category}`)}
                    </span>
                  </div>
                  <p className="text-charcoal-500 text-sm leading-relaxed mb-6">
                    {item.description[locale]}
                  </p>

                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    {quantity === 0 ? (
                      <button
                        onClick={() => { handleAdd(); setIsModalOpen(false); }}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        {t('menu.addToCart')}
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-center gap-4 bg-cream-200 rounded-xl px-4 py-3">
                        <button
                          onClick={() => updateQuantity(item.id, quantity - 1)}
                          className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-terracotta-500 hover:bg-terracotta-500 hover:text-white transition-all"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="font-bold text-charcoal-700 text-lg w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => addItem(item)}
                          className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-terracotta-500 hover:bg-terracotta-500 hover:text-white transition-all"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="btn-secondary py-3 px-5 text-sm"
                    >
                      {t('menu.close')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
