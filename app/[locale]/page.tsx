'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import MenuGrid from '@/components/MenuGrid';
import { useMenuStore } from '@/store/menuStore';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const { items } = useMenuStore();
  const { isLoggedIn } = useAuthStore();
  const { status } = useSession();
  
  const isAuth = status === 'authenticated' || isLoggedIn;

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-warm-gradient">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-terracotta-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-saffron-400/10 blur-3xl" />

        <div className="relative page-container text-center z-10 pt-24 pb-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-saffron-400 font-body font-semibold uppercase tracking-[0.3em] text-sm mb-6">
              {t('hero.premiumTag')}
            </p>
            <h1 className="font-display font-bold text-5xl md:text-7xl text-cream-100 leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-cream-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#menu" className="btn-gold text-base px-8 py-4 shadow-gold">{t('hero.cta')}</a>
              {!isAuth && (
                <Link href={`/${locale}/login`}
                  className="border-2 border-cream-200/40 text-cream-200 font-semibold px-8 py-4 rounded-xl hover:border-cream-100 hover:text-cream-100 transition-all">
                  {t('nav.login')}
                </Link>
              )}
            </div>
            <p className="text-cream-300 text-sm mt-6">🚚 {t('hero.tagline')}</p>
          </motion.div>

          <motion.a href="#menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-300 hover:text-saffron-400 transition-colors">
            <span className="text-xs uppercase tracking-widest">{t('hero.explore')}</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown size={20} />
            </motion.div>
          </motion.a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 pb-16 px-4 flex-wrap">
          {[
            t('hero.badges.quality'),
            t('hero.badges.delivery'),
            t('hero.badges.love')
          ].map((badge, i) => (
            <motion.div key={badge} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              className="glass-dark rounded-xl px-4 py-2.5 text-cream-200 text-sm font-medium">
              {badge}
            </motion.div>
          ))}
        </div>
      </section>

      <MenuGrid items={items} />

      <footer className="bg-charcoal-700 text-cream-200 py-12">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">Z</span>
            </div>
            <div>
              <p className="font-display font-bold text-xl text-cream-100">Zafaran</p>
              <p className="text-xs text-cream-300">{t('common.footer.tagline')}</p>
            </div>
          </div>
          <p className="text-sm text-cream-300">© {new Date().getFullYear()} Zafaran. {t('common.footer.crafted')}</p>
        </div>
      </footer>
    </div>
  );
}
