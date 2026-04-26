import { Link } from "@/i18n/routing";
import { Users, Briefcase, DollarSign, FileText, Home, Activity, ShieldAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function Sidebar() {
  const t = await getTranslations("Navigation");
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  const routes = [
    { name: t("dashboard"), href: "/", icon: Home, roles: ["SUPER_ADMIN", "DIRECTOR", "COORDINADOR", "TESORERO", "AUDITOR"] },
    { name: t("volunteers"), href: "/volunteers", icon: Users, roles: ["SUPER_ADMIN", "DIRECTOR", "COORDINADOR"] },
    { name: t("projects"), href: "/projects", icon: Briefcase, roles: ["SUPER_ADMIN", "DIRECTOR", "COORDINADOR", "AUDITOR"] },
    { name: t("funding"), href: "/funding", icon: DollarSign, roles: ["SUPER_ADMIN", "DIRECTOR", "TESORERO", "AUDITOR"] },
    { name: t("reports"), href: "/reports", icon: FileText, roles: ["SUPER_ADMIN", "DIRECTOR", "TESORERO", "AUDITOR"] },
    { name: t("impact"), href: "/impact", icon: Activity, roles: ["SUPER_ADMIN", "DIRECTOR", "COORDINADOR", "TESORERO", "AUDITOR"] },
    { name: "Auditoría", href: "/admin/audit", icon: ShieldAlert, roles: ["SUPER_ADMIN", "AUDITOR"] },
  ];

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-400">TerraCRM</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {routes.filter(r => !role || r.roles.includes(role)).map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href as any}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
            >
              <Icon className="w-5 h-5" />
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
}
