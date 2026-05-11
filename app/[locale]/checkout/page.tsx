'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Phone, MapPin, FileText } from 'lucide-react';
import Header from '@/components/Header';
import PaymentForm from '@/components/PaymentForm';
import AuthGuard from '@/components/AuthGuard';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore, PaymentMethod, Order } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';

const DELIVERY_FEE = 25;

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const tCart = useTranslations('cart');
  const tMenu = useTranslations('menu');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as 'en' | 'ar';

  const { items, getTotalPrice, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { user } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('online');

  const [deliveryData, setDeliveryData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardHolder: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    if (user) {
      setDeliveryData(prev => ({ ...prev, name: user.name || '' }));
    }
  }, [user]);

  if (!mounted) return null;

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 200 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  // Redirect if cart is empty
  if (items.length === 0) {
    router.replace(`/${locale}`);
    return null;
  }

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!deliveryData.name) errs.name = t('errors.nameRequired');
    if (!deliveryData.phone) errs.phone = t('errors.phoneRequired');
    else if (!/^\+?\d{10,14}$/.test(deliveryData.phone.replace(/\s/g, ''))) errs.phone = t('errors.phoneInvalid');
    if (!deliveryData.address) errs.address = t('errors.addressRequired');

    if (method === 'online') {
      if (!cardData.cardNumber) errs.cardNumber = t('errors.cardNumberRequired');
      else if (cardData.cardNumber.replace(/\s/g, '').length !== 16) errs.cardNumber = t('errors.cardNumberInvalid');

      if (!cardData.expiry) errs.expiry = t('errors.expiryRequired');
      else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardData.expiry)) errs.expiry = t('errors.expiryInvalid');

      if (!cardData.cvv) errs.cvv = t('errors.cvvRequired');
      else if (cardData.cvv.length < 3) errs.cvv = t('errors.cvvInvalid');

      if (!cardData.cardHolder) errs.cardHolder = t('errors.cardHolderRequired');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderId = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    
    const newOrder: Order = {
      id: orderId,
      userId: user?.id || 'guest',
      customerName: deliveryData.name,
      phone: deliveryData.phone,
      address: deliveryData.address,
      notes: deliveryData.notes,
      items: [...items],
      subtotal,
      deliveryFee,
      total,
      paymentMethod: method,
      status: 'received',
      createdAt: new Date().toISOString(),
      statusHistory: [{ status: 'received', timestamp: new Date().toISOString() }]
    };

    addOrder(newOrder);
    clearCart();
    
    router.push(`/${locale}/order-confirmation?id=${orderId}`);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-cream-100">
        <Header />

        <div className="pt-24 pb-20">
          <div className="page-container max-w-6xl">
            <h1 className="font-display font-bold text-4xl text-charcoal-700 mb-8">{t('title')}</h1>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Forms */}
              <div className="flex-1 space-y-8">
                {/* Delivery Info */}
                <section className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-charcoal-100">
                  <h2 className="font-display font-bold text-2xl text-charcoal-700 mb-6 pb-4 border-b border-charcoal-100">
                    {t('deliveryInfo')}
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-2">{t('name')}</label>
                      <div className="input-icon-wrapper">
                        <User size={18} className="input-icon" />
                        <input
                          type="text"
                          value={deliveryData.name}
                          onChange={(e) => setDeliveryData({ ...deliveryData, name: e.target.value })}
                          placeholder={t('namePlaceholder')}
                          className={`form-input input-with-icon ${errors.name ? 'form-input-error' : ''}`}
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-2">{t('phone')}</label>
                      <div className="input-icon-wrapper">
                        <Phone size={18} className="input-icon" />
                        <input
                          type="text"
                          value={deliveryData.phone}
                          onChange={(e) => setDeliveryData({ ...deliveryData, phone: e.target.value })}
                          placeholder={t('phonePlaceholder')}
                          className={`form-input input-with-icon ${errors.phone ? 'form-input-error' : ''}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-2">{t('address')}</label>
                      <div className="input-icon-wrapper items-start">
                        <MapPin size={18} className="absolute start-3.5 top-3.5 text-charcoal-300" />
                        <textarea
                          value={deliveryData.address}
                          onChange={(e) => setDeliveryData({ ...deliveryData, address: e.target.value })}
                          placeholder={t('addressPlaceholder')}
                          rows={3}
                          className={`form-input input-with-icon py-3 ${errors.address ? 'form-input-error' : ''}`}
                        />
                      </div>
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-2">{t('notes')}</label>
                      <div className="input-icon-wrapper items-start">
                        <FileText size={18} className="absolute start-3.5 top-3.5 text-charcoal-300" />
                        <textarea
                          value={deliveryData.notes}
                          onChange={(e) => setDeliveryData({ ...deliveryData, notes: e.target.value })}
                          placeholder={t('notesPlaceholder')}
                          rows={2}
                          className="form-input input-with-icon py-3"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment Method */}
                <section className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-charcoal-100">
                  <h2 className="font-display font-bold text-2xl text-charcoal-700 mb-6 pb-4 border-b border-charcoal-100">
                    {t('paymentMethod')}
                  </h2>
                  <PaymentForm
                    method={method}
                    onMethodChange={setMethod}
                    cardData={cardData}
                    onCardChange={(field, value) => setCardData(prev => ({ ...prev, [field]: value }))}
                    errors={errors}
                  />
                </section>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:w-[400px]">
                <div className="bg-white rounded-3xl p-6 shadow-card border border-charcoal-100 sticky top-28">
                  <h2 className="font-display font-bold text-2xl text-charcoal-700 mb-6 pb-4 border-b border-charcoal-100">
                    {t('orderSummary')}
                  </h2>

                  <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                    {items.map((ci) => (
                      <div key={ci.item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={ci.item.image} alt={ci.item.name[locale]} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-charcoal-700 text-sm">{ci.item.name[locale]}</p>
                          <p className="text-charcoal-400 text-xs mt-1">
                            {ci.quantity} × {ci.item.price} {tMenu('currency')}
                          </p>
                        </div>
                        <p className="font-bold text-charcoal-700 text-sm">
                          {ci.item.price * ci.quantity} {tMenu('currency')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 py-4 border-y border-charcoal-100 mb-6">
                    <div className="flex justify-between text-sm text-charcoal-500">
                      <span>{tCart('subtotal')}</span>
                      <span>{subtotal.toLocaleString()} {tMenu('currency')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-charcoal-500">
                      <span>{tCart('delivery')}</span>
                      <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                        {deliveryFee === 0 ? tCart('free') : `${deliveryFee} ${tMenu('currency')}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-xl text-charcoal-700 mb-8">
                    <span>{tCart('total')}</span>
                    <span className="text-terracotta-500">{total.toLocaleString()} {tMenu('currency')}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        {t('processing')}
                      </>
                    ) : (
                      t('placeOrder')
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
