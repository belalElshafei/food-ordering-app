'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Globe, User, Menu, X, Package, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = params.locale as string;
  const isRTL = locale === 'ar';

  const { getTotalItems, toggleCart } = useCartStore();
  const { user, isLoggedIn, logout } = useAuthStore();
  const { status, data: session } = useSession();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [badgeBounce, setBadgeBounce] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalItems = getTotalItems();
  const displayUser = session?.user || user;
  const isAuth = status === 'authenticated' || isLoggedIn;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && totalItems > prevCount) {
      setBadgeBounce(true);
      setTimeout(() => setBadgeBounce(false), 500);
    }
    setPrevCount(totalItems);
  }, [totalItems, mounted]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    logout();
    setIsUserMenuOpen(false);
    router.push(`/${locale}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navLinks = [
    { href: `/${locale}`, label: t('nav.menu') },
    ...(isAuth ? [{ href: `/${locale}/orders`, label: t('nav.myOrders') }] : []),
    { href: `/${locale}/admin`, label: t('nav.admin') },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-dark shadow-warm-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="page-container flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
            <span className="text-white font-display font-bold text-lg">Z</span>
          </div>
          <span className="font-display font-bold text-xl text-cream-100 group-hover:text-saffron-400 transition-colors">
            Zafaran
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-sm font-medium transition-colors hover:text-saffron-400 ${
                pathname === link.href ? 'text-saffron-400' : 'text-cream-200'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={switchLocale}
            className="hidden md:flex items-center gap-1.5 text-cream-200 hover:text-saffron-400 transition-colors text-sm font-medium px-2 py-1"
            title={locale === 'en' ? 'العربية' : 'English'}
          >
            <Globe size={16} />
            <span>{locale === 'en' ? 'AR' : 'EN'}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-terracotta-500/20 hover:bg-terracotta-500 text-cream-100 transition-all duration-200 group"
            aria-label={t('nav.cart')}
          >
            <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
            {mounted && (
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] rounded-full bg-saffron-400 text-charcoal-700 text-[10px] font-bold flex items-center justify-center px-1 ${
                      badgeBounce ? 'animate-bounce-once' : ''
                    }`}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            )}
          </button>

          {/* User Menu / Login */}
          {mounted && (
            isAuth && displayUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-saffron-400/20 hover:bg-saffron-400/30 text-saffron-400 font-bold text-sm transition-all"
                >
                  {displayUser.image ? (
                    <img
                      src={displayUser.image}
                      alt={displayUser.name || ''}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    getInitials(displayUser.name || 'U')
                  )}
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-12 end-0 w-56 glass-dark rounded-2xl shadow-warm-lg border border-saffron-400/20 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-cream-100 font-semibold text-sm truncate">{displayUser.name}</p>
                        <p className="text-cream-300 text-xs truncate">{displayUser.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          href={`/${locale}/orders`}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream-200 hover:bg-terracotta-500/20 hover:text-cream-100 transition-colors text-sm"
                        >
                          <Package size={15} />
                          {t('nav.myOrders')}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                        >
                          <LogOut size={15} />
                          {t('nav.logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="hidden md:flex items-center gap-2 btn-primary py-2 px-4 text-sm"
              >
                <User size={15} />
                {t('nav.login')}
              </Link>
            )
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-cream-100 hover:text-saffron-400 transition-colors"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-white/10"
          >
            <div className="page-container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-cream-200 hover:text-saffron-400 font-medium py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button onClick={switchLocale} className="flex items-center gap-2 text-cream-200 text-sm">
                  <Globe size={15} />
                  {locale === 'en' ? 'العربية' : 'English'}
                </button>
                {!isAuth && (
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setIsMobileOpen(false)}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
