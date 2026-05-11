'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LogOut, LayoutDashboard, ShoppingBag, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import AdminProductsTab from '@/components/AdminProductsTab';
import AdminOrdersTab from '@/components/AdminOrdersTab';
import { useOrderStore } from '@/store/orderStore';
import { useMenuStore } from '@/store/menuStore';

export default function AdminDashboard() {
  const t = useTranslations('admin');
  const tMenu = useTranslations('menu');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as 'en' | 'ar';

  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [mounted, setMounted] = useState(false);

  const { orders } = useOrderStore();
  const { items } = useMenuStore();

  useEffect(() => {
    setMounted(true);
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use env variable or fallback for prototype
    const correctPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'admin123';
    
    if (passcode === correctPasscode) {
      sessionStorage.setItem('admin_auth', 'true');
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
      setPasscode('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setAuthenticated(false);
    router.push(`/${locale}`);
  };

  if (!mounted) return null;

  // Compute Stats
  const pendingOrders = orders.filter(o => o.status === 'received').length;
  const inProgressOrders = orders.filter(o => o.status === 'preparing' || o.status === 'delivery').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-charcoal-700 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-warm-lg overflow-hidden"
        >
          <div className="bg-warm-gradient px-8 py-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-cream-100">{t('passcodeTitle')}</h1>
            <p className="text-cream-300 text-sm mt-2">{t('passcodeDesc')}</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8">
            <motion.div
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={t('passcodePlaceholder')}
                className={`form-input text-center tracking-[0.25em] text-lg py-3 ${error ? 'form-input-error' : ''}`}
                autoFocus
              />
            </motion.div>
            
            {error && <p className="text-red-500 text-xs text-center mt-2">{t('passcodeError')}</p>}
            
            <button
              type="submit"
              className="btn-primary w-full mt-6 py-3"
            >
              {t('passcodeSubmit')}
            </button>
            <Link 
              href={`/${locale}`}
              className="block text-center text-charcoal-400 hover:text-terracotta-500 text-sm font-semibold mt-4 transition-colors"
            >
              {t('backToMenu')}
            </Link>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Header />

      <div className="pt-24 pb-20">
        <div className="page-container max-w-6xl">
          
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-charcoal-700">{t('title')}</h1>
              <p className="text-charcoal-500 text-sm">{t('subtitle')}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-xl shadow-sm border border-charcoal-100 p-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'orders' ? 'bg-charcoal-700 text-cream-100 shadow-md' : 'text-charcoal-500 hover:text-charcoal-700'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  {t('orders')}
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'products' ? 'bg-charcoal-700 text-cream-100 shadow-md' : 'text-charcoal-500 hover:text-charcoal-700'
                  }`}
                >
                  <ShoppingBag size={16} />
                  {t('products')}
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                title={t('logout')}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-card border border-charcoal-100">
              <div className="flex items-center gap-3 mb-2 text-charcoal-500">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><LayoutDashboard size={16}/></div>
                <span className="text-sm font-semibold">{t('totalOrders')}</span>
              </div>
              <p className="text-3xl font-bold text-charcoal-700">{orders.length}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-card border border-charcoal-100">
              <div className="flex items-center gap-3 mb-2 text-charcoal-500">
                <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center"><AlertCircle size={16}/></div>
                <span className="text-sm font-semibold">{t('pending')}</span>
              </div>
              <p className="text-3xl font-bold text-charcoal-700">{pendingOrders}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-5 shadow-card border border-charcoal-100">
              <div className="flex items-center gap-3 mb-2 text-charcoal-500">
                <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center"><CheckCircle2 size={16}/></div>
                <span className="text-sm font-semibold">{t('delivered')}</span>
              </div>
              <p className="text-3xl font-bold text-charcoal-700">{deliveredOrders}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card border border-charcoal-100">
              <div className="flex items-center gap-3 mb-2 text-charcoal-500">
                <div className="w-8 h-8 rounded-full bg-terracotta-50 text-terracotta-500 flex items-center justify-center"><TrendingUp size={16}/></div>
                <span className="text-sm font-semibold">{t('totalRevenue')}</span>
              </div>
              <p className="text-2xl font-bold text-terracotta-500 truncate" title={`${totalRevenue} ${tMenu('currency')}`}>
                {totalRevenue.toLocaleString()} <span className="text-base">{tMenu('currency')}</span>
              </p>
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'orders' ? (
                <AdminOrdersTab locale={locale} />
              ) : (
                <AdminProductsTab locale={locale} />
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
