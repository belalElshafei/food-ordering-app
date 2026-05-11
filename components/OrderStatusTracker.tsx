'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ChefHat, Bike, Home } from 'lucide-react';
import { OrderStatus } from '@/store/orderStore';

const STAGES: { key: OrderStatus; icon: React.ReactNode }[] = [
  { key: 'received', icon: <CheckCircle2 size={22} /> },
  { key: 'preparing', icon: <ChefHat size={22} /> },
  { key: 'delivery', icon: <Bike size={22} /> },
  { key: 'delivered', icon: <Home size={22} /> },
];

const STATUS_ORDER: OrderStatus[] = ['received', 'preparing', 'delivery', 'delivered'];

interface OrderStatusTrackerProps {
  status: OrderStatus;
  statusHistory?: { status: OrderStatus; timestamp: string }[];
}

export default function OrderStatusTracker({ status, statusHistory = [] }: OrderStatusTrackerProps) {
  const t = useTranslations('status');
  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="w-full py-6">
      <div className="relative flex items-start justify-between">
        {/* Connecting Line Background */}
        <div className="absolute top-6 start-6 end-6 h-0.5 bg-charcoal-200 -z-0" />

        {/* Active Line */}
        <motion.div
          className="absolute top-6 start-6 h-0.5 bg-gradient-to-r from-terracotta-500 to-saffron-400 -z-0"
          initial={{ width: '0%' }}
          animate={{
            width: currentIndex === 0 ? '0%'
              : currentIndex === 1 ? '33%'
              : currentIndex === 2 ? '66%'
              : '100%',
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {STAGES.map((stage, i) => {
          const isDone = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const historyEntry = statusHistory.find((h) => h.status === stage.key);

          return (
            <div key={stage.key} className="flex flex-col items-center gap-2 flex-1 relative z-10">
              {/* Icon Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{
                  scale: isCurrent ? 1.15 : 1,
                  opacity: isDone ? 1 : 0.4,
                }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isDone
                    ? 'bg-terracotta-500 border-terracotta-500 text-white shadow-warm'
                    : 'bg-white border-charcoal-200 text-charcoal-300'
                } ${isCurrent ? 'ring-4 ring-terracotta-500/20 animate-pulse-gold' : ''}`}
              >
                {stage.icon}
              </motion.div>

              {/* Label */}
              <div className="text-center flex-shrink-0">
                <p className={`text-xs font-semibold leading-tight ${isDone ? 'text-terracotta-500' : 'text-charcoal-400'}`}>
                  {t(stage.key)}
                </p>
                {historyEntry && (
                  <p className="text-[10px] text-charcoal-300 mt-0.5">
                    {new Date(historyEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
