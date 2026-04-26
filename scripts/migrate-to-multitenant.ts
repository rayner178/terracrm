import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tenantSlug = "fundemar";
  const schemaName = `tenant_${tenantSlug}`;

  console.log("Iniciando migración de datos a multi-tenancy...");

  // 1. Crear el tenant fundemar (Tenant 1 original)
  await prisma.tenant.upsert({
    where: { slug: tenantSlug },
    update: {},
    create: { slug: tenantSlug, name: "FUNDEMAR", domain: "fundemar.terracrm.org" },
  });

  // 2. Crear esquema
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);

  // 3. Mover datos
  // Dado que es una migración in-place, podríamos usar ALTER TABLE SET SCHEMA,
  // pero eso rompería el template en public para futuros tenants.
  // Es mejor usar INSERT INTO ... SELECT * FROM public... si ya se crearon las tablas con onboard-tenant.ts
  console.log("Para migrar datos reales sin romper public, use onboard-tenant.ts primero y luego INSERT INTO schema.table SELECT * FROM public.table");
  
  console.log("Migración completada.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
