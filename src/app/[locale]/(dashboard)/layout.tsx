import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { LayoutDashboard, Users, Briefcase, DollarSign, PieChart } from "lucide-react";

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Voluntarios', href: '/volunteers', icon: Users },
  { name: 'Proyectos', href: '/projects', icon: Briefcase },
  { name: 'Fondos', href: '/funding', icon: DollarSign },
  { name: 'Reportes', href: '/reports', icon: PieChart },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
