import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, DollarSign, Activity } from "lucide-react";
import { container } from "@/core/di/registry";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/es/login');
  }

  // Wrap queries in try/catch — if tenant schema is missing, show empty dashboard
  // instead of crashing the server with a 500
  let volunteersResult: { data: any[]; total: number } = { data: [], total: 0 };
  let projects: any[] = [];
  let donations: any[] = [];

  try {
    [volunteersResult, projects, donations] = await Promise.all([
      container.volunteerRepository.getAll(1, 10),
      container.projectRepository.getAll(),
      container.donationRepository.getAll(),
    ]);
  } catch (e) {
    console.error("[Dashboard] Error loading tenant data:", e);
    // Fallback: render dashboard with zeros — no crash
  }

  const volunteersCount = volunteersResult.total;
  const activeProjects = projects.filter(p => p.status !== "COMPLETED").length;
  const totalFunds = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Resumen General</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Voluntarios Registrados</CardTitle>
            <Users className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{volunteersCount}</div>
            <p className="text-xs text-slate-500 mt-1">En la base de datos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Proyectos Activos</CardTitle>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{activeProjects}</div>
            <p className="text-xs text-slate-500 mt-1">De {projects.length} en total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Fondos Recaudados</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">${totalFunds.toLocaleString("en-US")}</div>
            <p className="text-xs text-slate-500 mt-1">Total histórico</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Donaciones Registradas</CardTitle>
            <Activity className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{donations.length}</div>
            <p className="text-xs text-slate-500 mt-1">Aportes recibidos</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mt-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Últimos Proyectos</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {projects.slice(0, 5).map(p => (
                  <div key={p.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.location || "Sin ubicación"}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">{p.status}</span>
                  </div>
                ))}
                {projects.length === 0 && <p className="text-slate-500 text-sm">No hay proyectos registrados.</p>}
             </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Últimas Donaciones</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {donations.slice(0, 5).map(d => (
                  <div key={d.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{d.donorName}</p>
                      <p className="text-xs text-slate-500">{new Date(d.date).toLocaleDateString()}</p>
                    </div>
                    <div className="font-semibold text-emerald-600">
                      ${d.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
                {donations.length === 0 && <p className="text-slate-500 text-sm">No hay donaciones registradas.</p>}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
