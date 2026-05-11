'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Category } from '@/lib/menuData';

const CATEGORIES: { key: 'all' | Category; emoji: string }[] = [
  { key: 'all', emoji: '🍽️' },
  { key: 'burgers', emoji: '🍔' },
  { key: 'pizza', emoji: '🍕' },
  { key: 'drinks', emoji: '🥤' },
  { key: 'desserts', emoji: '🍮' },
];

interface CategoryFilterProps {
  selected: 'all' | Category;
  onChange: (cat: 'all' | Category) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const t = useTranslations('menu.categories');

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
            selected === cat.key
              ? 'text-cream-100 shadow-warm'
              : 'bg-white text-charcoal-500 hover:bg-cream-200 hover:text-charcoal-700 shadow-card'
          }`}
        >
          {selected === cat.key && (
            <motion.span
              layoutId="category-bg"
              className="absolute inset-0 rounded-full bg-terracotta-500"
              style={{ zIndex: -1 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span>{cat.emoji}</span>
          <span>{t(cat.key)}</span>
        </button>
      ))}
    </div>
  );
}
