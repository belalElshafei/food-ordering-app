'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): { score: number; label: 'weak' | 'fair' | 'strong' } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'weak' };
  if (score <= 3) return { score, label: 'fair' };
  return { score, label: 'strong' };
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const t = useTranslations('auth.strength');
  const { score, label } = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  const colors = {
    weak: 'bg-red-400',
    fair: 'bg-saffron-400',
    strong: 'bg-green-500',
  };

  const textColors = {
    weak: 'text-red-500',
    fair: 'text-saffron-500',
    strong: 'text-green-600',
  };

  const filledBars = label === 'weak' ? 1 : label === 'fair' ? 2 : 3;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5 mb-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= filledBars ? colors[label] : 'bg-charcoal-200'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-charcoal-400">{t('label')}</p>
        <p className={`text-xs font-semibold ${textColors[label]}`}>{t(label)}</p>
      </div>
    </div>
  );
}
