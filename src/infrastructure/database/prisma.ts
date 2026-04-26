import { PrismaClient } from "@prisma/client";
import { getTenantSlug } from "@/core/tenant/tenantContext";

const globalForPrisma = global as unknown as { 
  basePrisma: PrismaClient;
  tenantClients: Map<string, PrismaClient>;
};

export const basePrisma = globalForPrisma.basePrisma || new PrismaClient();
const tenantClients = globalForPrisma.tenantClients || new Map<string, PrismaClient>();

// Cache clients globally in ALL environments to survive warm Lambda containers
// This is safe — Vercel reuses containers between requests on the same instance
globalForPrisma.basePrisma = basePrisma;
globalForPrisma.tenantClients = tenantClients;

const PUBLIC_MODELS = ["tenant", "user"];

function getClientForTenant(tenantSlug: string): PrismaClient {
  if (tenantClients.has(tenantSlug)) {
    return tenantClients.get(tenantSlug)!;
  }

  const databaseUrl = process.env.DATABASE_URL || "";
  
  let tenantUrl = databaseUrl;
  if (tenantUrl.includes('?')) {
    // Remove search_path if exists to avoid conflicts, then append schema
    tenantUrl = tenantUrl.replace(/&schema=[^&]*/, '').replace(/\?schema=[^&]*&/, '?').replace(/\?schema=[^&]*$/, '');
    tenantUrl += tenantUrl.includes('?') ? `&schema=tenant_${tenantSlug}` : `?schema=tenant_${tenantSlug}`;
  } else {
    tenantUrl += `?schema=tenant_${tenantSlug}`;
  }

  const client = new PrismaClient({
    datasources: {
      db: { url: tenantUrl },
    },
  });

  tenantClients.set(tenantSlug, client);
  return client;
}

// Extensión para enrutar la consulta al PrismaClient correspondiente
export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (PUBLIC_MODELS.includes(model.toLowerCase())) {
          return query(args); // Usa la conexión base ("public")
        }

        let tenantSlug: string | null = null;
        try {
          tenantSlug = await getTenantSlug();
        } catch (e) {}
        
        if (!tenantSlug && process.env.TEST_TENANT_SLUG) {
          tenantSlug = process.env.TEST_TENANT_SLUG;
        }

        if (!tenantSlug) {
          throw new Error(`Acceso denegado: No se detectó tenant_slug en el contexto para el modelo ${model}`);
        }

        // Obtener o crear el cliente cacheado del tenant
        const tenantClient = getClientForTenant(tenantSlug);
        
        // Ejecutar la operación en el cliente aislado
        return (tenantClient as any)[model][operation](args);
      },
    },
  },
}) as unknown as PrismaClient; // Cast to bypass types of nested extensions
