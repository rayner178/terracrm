"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Users, Briefcase, DollarSign, FileText, Home, Activity, ShieldAlert, X, Upload } from "lucide-react";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useMobileSidebar } from "./MobileSidebarProvider";

interface SidebarProps {
  role?: string;
}

export function Sidebar({ role }: SidebarProps) {
  const t = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const { isOpen, close } = useMobileSidebar();
  const pathname = usePathname();

  // Close sidebar on route change (navigation)
  useEffect(() => {
    close();
  }, [pathname, close]);

  const routes = [
    { name: t("dashboard"),  href: "/",            icon: Home,        roles: ["SUPER_ADMIN","DIRECTOR","COORDINADOR","TESORERO","AUDITOR"] },
    { name: t("volunteers"), href: "/volunteers",   icon: Users,       roles: ["SUPER_ADMIN","DIRECTOR","COORDINADOR"] },
    { name: t("projects"),   href: "/projects",     icon: Briefcase,   roles: ["SUPER_ADMIN","DIRECTOR","COORDINADOR","AUDITOR"] },
    { name: t("funding"),    href: "/funding",      icon: DollarSign,  roles: ["SUPER_ADMIN","DIRECTOR","TESORERO","AUDITOR"] },
    { name: t("reports"),    href: "/reports",      icon: FileText,    roles: ["SUPER_ADMIN","DIRECTOR","TESORERO","AUDITOR"] },
    { name: t("impact"),     href: "/impact",       icon: Activity,    roles: ["SUPER_ADMIN","DIRECTOR","COORDINADOR","TESORERO","AUDITOR"] },
    { name: t("import"),     href: "/import",       icon: Upload,      roles: ["SUPER_ADMIN","DIRECTOR"] },
    { name: t("audit"),      href: "/admin/audit",  icon: ShieldAlert, roles: ["SUPER_ADMIN","AUDITOR"] },
  ];

  const filteredRoutes = routes.filter(r => !role || r.roles.includes(role));

  const navContent = (
    <div className="flex flex-col w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-400">TerraCRM</h1>
        <button
          onClick={close}
          className="md:hidden text-slate-400 hover:text-white transition-colors p-1"
          aria-label={tCommon("closeMenu")}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {filteredRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href as any}
              className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-slate-800 transition-colors text-slate-300 hover:text-white min-h-[44px]"
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{route.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-slate-800 text-xs text-slate-500">
        &copy; 2026 Terra ONG
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <aside className="hidden md:flex flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile drawer — slides in from left */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full z-10 shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
