"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'es' ? 'en' : 'es';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button 
      onClick={toggleLocale}
      className="text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors px-2 py-1 rounded border border-slate-200"
      title="Cambiar idioma / Change language"
    >
      {locale.toUpperCase()}
    </button>
  );
}
