"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { syncQueue } from "@/core/offline/syncQueue";
import { Wifi, WifiOff, Save, CheckCircle2 } from "lucide-react";

export default function FieldPage() {
  const { data: session, status } = useSession();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  // Form state
  const [metricDefinitionId, setMetricDefinitionId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [value, setValue] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
      setIsOnline(true);
      syncNow();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial count
    updateCount();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getTenantSlugFromURL = () => {
    // Si estamos en PWA, el subdominio está en el hostname
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.includes(".terracrm.org")) {
        return hostname.split(".")[0];
      }
    }
    return "fundemar"; // fallback dev
  };

  const updateCount = async () => {
    const tenantSlug = getTenantSlugFromURL();
    const pending = await syncQueue.getAllPending(tenantSlug);
    setPendingCount(pending.length);
  };

  const syncNow = async () => {
    if (!navigator.onLine || !(session?.user as any)?.id) return;
    
    const tenantSlug = getTenantSlugFromURL();
    const pending = await syncQueue.getAllPending(tenantSlug);
    if (pending.length === 0) return;

    try {
      const response = await fetch("/api/sync/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: pending })
      });

      if (response.ok) {
        for (const record of pending) {
          await syncQueue.remove(record.id);
        }
        updateCount();
      }
    } catch (e) {
      console.error("Error sincronizando", e);
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(session?.user as any)?.id) return;

    const tenantSlug = getTenantSlugFromURL();

    await syncQueue.add({
      tenantSlug,
      metricDefinitionId,
      projectId: projectId || undefined,
      value: parseFloat(value),
      date: new Date().toISOString(),
      recordedById: (session?.user as any)?.id || "unknown"
    });

    setSavedMessage(true);
    setMetricDefinitionId("");
    setValue("");
    setTimeout(() => setSavedMessage(false), 2000);
    
    updateCount();
    
    if (navigator.onLine) {
      syncNow();
    }
  };

  // Autenticación encapsulada directamente en el componente para PWA
  if (status === "loading") return <div className="p-8 text-center">Verificando sesión...</div>;
  
  if (status === "unauthenticated") {
    // Si la PWA se abre sin sesión caché, forzamos alerta de login local
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-sm">
          <div className="bg-rose-100 text-rose-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Requiere Autenticación</h2>
          <p className="text-slate-600 text-sm mb-4">
            Debes iniciar sesión con conexión a internet al menos una vez para trabajar en modo offline.
          </p>
          <a href="/login" className="block w-full py-2 px-4 bg-emerald-600 text-white rounded font-medium">Ir al Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-emerald-700 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="font-bold">Registro de Campo (PWA)</h1>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <span className="flex items-center text-xs bg-emerald-600 px-2 py-1 rounded-full"><Wifi className="w-3 h-3 mr-1" /> Online</span>
          ) : (
            <span className="flex items-center text-xs bg-amber-500 px-2 py-1 rounded-full"><WifiOff className="w-3 h-3 mr-1" /> Offline</span>
          )}
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center justify-between mb-6 shadow-sm">
            <span className="text-sm text-amber-800 font-medium">{pendingCount} registros pendientes</span>
            <button 
              onClick={syncNow} 
              disabled={!isOnline}
              className="text-xs bg-amber-200 text-amber-800 px-3 py-1 rounded-full disabled:opacity-50 font-bold"
            >
              Sincronizar
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center">
            <Save className="w-5 h-5 mr-2 text-emerald-600" /> Nueva Métrica
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proyecto (Opcional)</label>
              <input 
                type="text" 
                value={projectId} 
                onChange={e => setProjectId(e.target.value)}
                placeholder="ID del Proyecto..."
                className="w-full border-slate-200 rounded-lg p-3 bg-slate-50 text-sm focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ID Definición Métrica</label>
              <input 
                type="text" 
                value={metricDefinitionId} 
                onChange={e => setMetricDefinitionId(e.target.value)}
                placeholder="ej: metric-123..."
                required
                className="w-full border-slate-200 rounded-lg p-3 bg-slate-50 text-sm focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor Registrado</label>
              <input 
                type="number" 
                step="0.01"
                value={value} 
                onChange={e => setValue(e.target.value)}
                placeholder="0.00"
                required
                className="w-full border-slate-200 rounded-lg p-3 bg-slate-50 text-sm focus:ring-emerald-500"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg shadow mt-2 flex justify-center items-center"
            >
              Guardar Localmente
            </button>

            {savedMessage && (
              <p className="text-emerald-600 text-xs text-center font-medium flex items-center justify-center mt-2 animate-pulse">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Guardado en IndexedDB
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
