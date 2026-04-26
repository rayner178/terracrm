import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { basePrisma, prisma } from "@/infrastructure/database/prisma";
import { ShieldCheck, Webhook } from "lucide-react";
import { getTenantSlug } from "@/core/tenant/tenantContext";

export default async function KoboAdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const tenantSlug = await getTenantSlug();
  
  // Obtener config global del tenant
  const tenant = await basePrisma.tenant.findUnique({
    where: { slug: tenantSlug || "" }
  });

  // Obtener mappings del tenant aislado
  const mappings = await prisma.koboFormMapping.findMany();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
          <Webhook className="w-8 h-8 mr-3 text-indigo-600" />
          Integración KoboToolbox
        </h1>
        <p className="text-slate-500 mt-2">
          Configura los webhooks y el mapeo de formularios para ingestar métricas automáticamente.
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
        <h2 className="text-lg font-bold text-indigo-900 flex items-center mb-4">
          <ShieldCheck className="w-5 h-5 mr-2" /> Webhook Secret
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-indigo-800 mb-1">URL del Webhook (Configurar en KoboToolbox)</label>
            <code className="block p-3 bg-white border border-indigo-200 rounded text-sm text-slate-600 select-all">
              https://{tenantSlug}.terracrm.org/api/v1/webhooks/kobo?tenant={tenantSlug}
            </code>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-indigo-800 mb-1">HMAC Secret Key</label>
            <input 
              type="text" 
              readOnly 
              value={tenant?.koboWebhookSecret || "No configurado"}
              className="w-full p-3 border border-indigo-200 rounded bg-white font-mono text-sm"
            />
            <p className="text-xs text-indigo-600 mt-2">
              Pega este secret en la configuración REST Services de tu proyecto en KoboToolbox.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Mapeo de Formularios</h2>
            <p className="text-sm text-slate-500">Relaciona los IDs de campos de Kobo con las Métricas del CRM.</p>
          </div>
          <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700">
            + Nuevo Mapeo
          </button>
        </div>
        
        {mappings.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No hay formularios mapeados todavía.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-4 font-medium">Form ID (Kobo)</th>
                <th className="p-4 font-medium">Campos Mapeados</th>
                <th className="p-4 font-medium">Actualizado</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mappings.map(m => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-slate-700">{m.formId}</td>
                  <td className="p-4 text-slate-600">{Object.keys(m.mapping as Record<string, string>).length} campos</td>
                  <td className="p-4 text-slate-500">{new Date(m.updatedAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
