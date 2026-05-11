'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Banknote, Eye, EyeOff } from 'lucide-react';
import { PaymentMethod } from '@/store/orderStore';

interface PaymentFormProps {
  method: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
  cardData: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    cardHolder: string;
  };
  onCardChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

function detectCardType(number: string): 'visa' | 'mastercard' | null {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
  return null;
}

function formatCardNumber(value: string): string {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 4);
  if (cleaned.length > 2) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return cleaned;
}

export default function PaymentForm({
  method,
  onMethodChange,
  cardData,
  onCardChange,
  errors,
}: PaymentFormProps) {
  const t = useTranslations('checkout');
  const [showCvv, setShowCvv] = useState(false);
  const cardType = detectCardType(cardData.cardNumber);

  return (
    <div className="space-y-5">
      {/* Method Toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onMethodChange('online')}
          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
            method === 'online'
              ? 'border-terracotta-500 bg-terracotta-500/5'
              : 'border-charcoal-200 bg-white hover:border-terracotta-300'
          }`}
        >
          <CreditCard size={22} className={method === 'online' ? 'text-terracotta-500' : 'text-charcoal-400'} />
          <span className={`text-sm font-semibold ${method === 'online' ? 'text-terracotta-500' : 'text-charcoal-500'}`}>
            {t('payOnline')}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onMethodChange('cash')}
          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
            method === 'cash'
              ? 'border-green-500 bg-green-500/5'
              : 'border-charcoal-200 bg-white hover:border-green-300'
          }`}
        >
          <Banknote size={22} className={method === 'cash' ? 'text-green-600' : 'text-charcoal-400'} />
          <span className={`text-sm font-semibold ${method === 'cash' ? 'text-green-600' : 'text-charcoal-500'}`}>
            {t('payCash')}
          </span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {method === 'cash' ? (
          <motion.div
            key="cash"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl p-4"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Banknote size={24} className="text-green-600" />
            </div>
            <p className="text-green-700 text-sm">{t('cashDesc')}</p>
          </motion.div>
        ) : (
          <motion.div
            key="online"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Card Number */}
            <div>
              <label className="block text-sm font-semibold text-charcoal-600 mb-2">{t('cardNumber')}</label>
              <div className="input-icon-wrapper">
                <input
                  type="text"
                  value={cardData.cardNumber}
                  onChange={(e) => onCardChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder={t('cardNumberPlaceholder')}
                  className={`form-input input-with-icon-end ${errors.cardNumber ? 'form-input-error' : ''}`}
                  maxLength={19}
                />
                <div className="absolute end-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {cardType === 'visa' && (
                    <span className="text-blue-700 font-bold text-sm italic">VISA</span>
                  )}
                  {cardType === 'mastercard' && (
                    <div className="flex">
                      <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
                      <div className="w-5 h-5 rounded-full bg-yellow-400 -ml-2.5 opacity-90" />
                    </div>
                  )}
                </div>
              </div>
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal-600 mb-2">{t('expiry')}</label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={(e) => onCardChange('expiry', formatExpiry(e.target.value))}
                  placeholder={t('expiryPlaceholder')}
                  className={`form-input ${errors.expiry ? 'form-input-error' : ''}`}
                  maxLength={5}
                />
                {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-600 mb-2">{t('cvv')}</label>
                <div className="input-icon-wrapper">
                    <input
                      type={showCvv ? 'text' : 'password'}
                      value={cardData.cvv}
                      onChange={(e) => onCardChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder={t('cvvPlaceholder')}
                      className={`form-input input-with-icon-end ${errors.cvv ? 'form-input-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      className="input-icon-end"
                    >
                    {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>

            {/* Cardholder */}
            <div>
              <label className="block text-sm font-semibold text-charcoal-600 mb-2">{t('cardHolder')}</label>
              <input
                type="text"
                value={cardData.cardHolder}
                onChange={(e) => onCardChange('cardHolder', e.target.value)}
                placeholder={t('cardHolderPlaceholder')}
                className={`form-input ${errors.cardHolder ? 'form-input-error' : ''}`}
              />
              {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
