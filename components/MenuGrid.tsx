'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import CategoryFilter from './CategoryFilter';
import MenuCard from './MenuCard';
import { MenuItem, Category } from '@/lib/menuData';

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');

  const filtered = selectedCategory === 'all'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <section id="menu" className="section-padding bg-cream-100">
      <div className="page-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-saffron-400 font-body font-semibold uppercase tracking-widest text-sm mb-3"
          >
            ✦ {t('menu.subtitle')} ✦
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl text-charcoal-700"
          >
            {t('menu.title')}
          </motion.h2>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex justify-center mb-10"
        >
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-charcoal-400">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-display text-xl">No items found</p>
          </div>
        )}
      </div>
    </section>
  );
}
