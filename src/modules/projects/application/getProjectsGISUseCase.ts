import { basePrisma } from "@/infrastructure/database/prisma";
import { getTenantSlug } from "@/core/tenant/tenantContext";

export class GetProjectsGISUseCase {
  async execute() {
    // Usamos queryRaw para parsear la geometría como GeoJSON nativo
    // Nota: A nivel de BD, Prisma se encarga de aislar esto si es llamado
    // a través del Prisma client extendido. Pero queryRawUnsafe no está interceptado 
    // en nuestra extensión por defecto, por lo que inyectamos el tenant.
    
    // Al usar queryRaw normal (no Unsafe), Prisma intercepta los modelos, 
    // pero para raw sql en multi-tenant dinámico con schema, a veces necesitamos
    // forzar el search_path o leer el schema del environment.
    
    let tenantSlug = await getTenantSlug();
    if (!tenantSlug && process.env.TEST_TENANT_SLUG) {
      tenantSlug = process.env.TEST_TENANT_SLUG;
    }
    
    if (!tenantSlug) {
      throw new Error("Acceso denegado: No se detectó tenant_slug");
    }

    const schemaName = `tenant_${tenantSlug}`;

    // Para raw queries dinámicas necesitamos inyectar el esquema manualmente en la consulta
    // ya que Prisma 5 prepared statements no permiten esquemas parametrizados.
    // Usamos $queryRawUnsafe bajo nuestro propio riesgo, pero sanitizando el schemaName
    if (!/^[a-zA-Z0-9_]+$/.test(tenantSlug)) {
        throw new Error("Invalid tenant slug");
    }

    const result = await basePrisma.$queryRawUnsafe(`
      SELECT 
        id, 
        name, 
        description, 
        "ecosystemType", 
        status, 
        ST_AsGeoJSON(geom)::json as geojson
      FROM "${schemaName}"."Project"
      WHERE geom IS NOT NULL
    `);
    
    return result as any[];
  }
}
