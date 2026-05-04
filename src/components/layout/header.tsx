"use client";

import { Bell, Search, LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { useMobileSidebar } from "./MobileSidebarProvider";

export function Header() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const { open } = useMobileSidebar();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={open}
          className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={t("openMenu")}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search — hidden on small mobile, visible on sm+ */}
        <div className="hidden sm:flex items-center text-slate-400">
          <Search className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder={t("search")}
            className="bg-transparent border-none focus:outline-none text-sm text-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <LanguageSwitcher />
        <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm flex-shrink-0">
          A
        </div>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
          className="text-slate-400 hover:text-rose-600 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          title={t("logout")}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
