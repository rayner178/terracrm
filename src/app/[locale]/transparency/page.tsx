import { container } from "@/core/di/registry";
import { Link } from "@/i18n/routing";
import { Globe, Heart, CheckCircle2, TrendingUp, ChevronLeft } from "lucide-react";
import DynamicProjectMap from "@/components/maps/DynamicProjectMap";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal de Transparencia — TerraCRM",
  description: "Conoce el impacto real de TerraCRM: fondos recaudados, proyectos activos y métricas de conservación.",
  openGraph: {
    title: "🌿 Transparencia Total | TerraCRM",
    description: "El 88% de cada donación va directo a conservación. Ver el impacto real.",
    type: "website",
  },
};

// ISR: Cacheamos esta página y la regeneramos en background cada 1 hora (3600 segundos)
export const revalidate = 3600;

interface ImpactMetric {
  id: string;
  name: string;
  totalValue: number;
  unit: string;
  description?: string;
}

interface TransparencyData {
  totalRaised: number;
  donationsCount: number;
  projectsCount: number;
  impact: ImpactMetric[];
}

export default async function TransparencyPage() {
  // try/catch — si Prisma falla, muestra métricas en cero pero NO se cae
  let data: TransparencyData = { totalRaised: 0, donationsCount: 0, projectsCount: 0, impact: [] };
  let projectsGIS: any[] = [];

  try {
    [data, projectsGIS] = await Promise.all([
      container.getPublicTransparencyDataUseCase.execute(),
      container.getProjectsGISUseCase.execute(),
    ]);
  } catch (e) {
    console.error("[Transparency] Error loading data:", e);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-emerald-700 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-dots"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Link href="/donate" className="inline-flex items-center text-emerald-200 hover:text-white transition text-sm mb-6 font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver a Donaciones
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Portal Público de Transparencia
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-emerald-100">
            En TerraCRM creemos que el impacto real se construye con confianza. Descubre cómo tus aportes están cambiando el mundo.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Fondos Recaudados</h3>
            <p className="text-4xl font-bold text-slate-800">${data.totalRaised.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-2">A través de {data.donationsCount} donaciones</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Proyectos Financiados</h3>
            <p className="text-4xl font-bold text-slate-800">{data.projectsCount}</p>
            <p className="text-xs text-slate-400 mt-2">Activos y completados</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Costo Administrativo</h3>
            <p className="text-4xl font-bold text-slate-800">12%</p>
            <p className="text-xs text-slate-400 mt-2">88% va directo a conservación</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-16">
          <div className="bg-slate-50 border-b border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800">Impacto Ecológico Auditado</h2>
            <p className="text-slate-500 mt-1">Métricas globales validadas por nuestros coordinadores en campo.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.impact.map((metric) => (
                <div key={metric.id} className="p-5 border border-slate-100 rounded-xl bg-slate-50 flex items-start space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">
                      {metric.totalValue.toLocaleString()} <span className="text-sm font-medium text-slate-500">{metric.unit}</span>
                    </h4>
                    <p className="text-sm font-medium text-slate-700">{metric.name}</p>
                    {metric.description && <p className="text-xs text-slate-500 mt-1">{metric.description}</p>}
                  </div>
                </div>
              ))}
              {data.impact.length === 0 && (
                <div className="col-span-3 text-center py-8 text-slate-500">
                  Estamos recopilando las primeras métricas de impacto de este periodo.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-16">
          <div className="bg-slate-50 border-b border-slate-200 p-6">
            <h2 className="text-2xl font-bold text-slate-800">Mapa Interactivo de Proyectos</h2>
            <p className="text-slate-500 mt-1">Explora nuestras áreas de intervención a través de ecosistemas críticos.</p>
          </div>
          <div className="p-6">
            <DynamicProjectMap projects={projectsGIS} />
          </div>
        </div>

        <div className="text-center pb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Sé parte del cambio</h2>
          <Link href="/donate" className="inline-flex bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1 text-lg">
            Hacer una Donación
          </Link>
        </div>
      </div>
    </div>
  );
}
