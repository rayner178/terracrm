"use client";

import dynamic from "next/dynamic";

// Este componente envuelve el mapa de Leaflet, forzando ssr: false
// desde un Client Component para evitar el error de Next.js App Router
const ProjectMapInner = dynamic(() => import("./ProjectMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Cargando mapa interactivo...</div>
});

export default function DynamicProjectMap({ projects }: { projects: any[] }) {
  return <ProjectMapInner projects={projects} />;
}
