import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const slug = process.argv[2];
  const name = process.argv[3];

  if (!slug || !name) {
    console.error("Uso: npx tsx scripts/onboard-tenant.ts <slug> <nombre>");
    process.exit(1);
  }

  console.log(`Onboarding tenant: ${name} (${slug})...`);

  // 1. Crear el registro en public.Tenant
  await prisma.tenant.upsert({
    where: { slug },
    update: { name },
    create: { slug, name, domain: `${slug}.terracrm.org` },
  });

  // 2. Crear el schema del tenant en Postgres y habilitar PostGIS
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis SCHEMA public;`);
  
  const schemaName = `tenant_${slug}`;
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);

  console.log(`Schema ${schemaName} creado. Clonando tablas de public...`);

  // 3. Clonar la estructura de las tablas desde public
  // Las tablas que son privadas al tenant. (Excluimos User, Tenant, AuditLog - si el AuditLog es global, pero lo mantendremos por tenant)
  // Como Prisma crea todo en public, lo usamos de template.
  const tablesToClone = [
    "Volunteer", 
    "Project", 
    "ProjectVolunteer", 
    "Donation", 
    "MetricDefinition", 
    "MetricRecord", 
    "AuditLog",
    "KoboFormMapping"
  ];

  for (const table of tablesToClone) {
    try {
      // LIKE copia la estructura, CONSTRAINTS copia llaves foráneas/índices
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${schemaName}"."${table}" (
          LIKE public."${table}" INCLUDING ALL
        );
      `);
    } catch (error) {
      console.log(`Nota: Posible error clonando ${table} (tal vez ya existe)`);
    }
  }

  // 4. Crear Super Admin Inicial (User es global, pero le damos rol SUPER_ADMIN)
  const email = `admin@${slug}.org`;
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: `Administrador ${name}`,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      mustChangePassword: true,
    },
  });

  console.log(`Tenant ${name} creado con éxito. Admin: ${email} / admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
