"use client";
import { Bell, Search, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('Common');

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center text-slate-400">
        <Search className="w-5 h-5 mr-2" />
        <input 
          type="text" 
          placeholder={t('search')} 
          className="bg-transparent border-none focus:outline-none text-sm text-slate-700"
        />
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
          A
        </div>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-slate-400 hover:text-rose-600 transition-colors ml-4" title={t('logout')}>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
