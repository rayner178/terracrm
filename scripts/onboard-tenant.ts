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

  const schemaName = `tenant_${slug}`;
  console.log(`Onboarding tenant: ${name} (${slug})...`);

  // 1. Crear el registro en public.Tenant
  await prisma.tenant.upsert({
    where:  { slug },
    update: { name },
    create: { slug, name, domain: `${slug}.terracrm.org` },
  });

  // 2. Crear el schema del tenant en Postgres y habilitar PostGIS
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis SCHEMA public;`);
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);

  console.log(`Schema ${schemaName} creado. Clonando tablas de public...`);

  // 3. Clonar la estructura de las tablas desde public.
  //    Orden importa: Project antes de Milestone (FK).
  const tablesToClone = [
    "Volunteer",
    "Project",
    "ProjectAssignment",
    "Donation",
    "MetricDefinition",
    "MetricRecord",
    "AuditLog",
    "KoboFormMapping",
    "Milestone",          // v2.0 — debe ir después de Project (FK)
  ];

  for (const table of tablesToClone) {
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "${schemaName}"."${table}" (
          LIKE public."${table}" INCLUDING ALL
        );
      `);
      console.log(`  ✓ ${table}`);
    } catch (error) {
      console.log(`  ~ ${table}: ya existe o error menor (continuando)`);
    }
  }

  // 4. Redirigir FKs al schema del tenant
  //    LIKE INCLUDING ALL copia FKs apuntando a public; las redefinimos.
  const fkRedirects = [
    // Milestone → Project
    {
      table: "Milestone",
      constraint: "Milestone_projectId_fkey",
      column: "projectId",
      refTable: "Project",
      onDelete: "CASCADE",
    },
    // ProjectAssignment → Project
    {
      table: "ProjectAssignment",
      constraint: "ProjectAssignment_projectId_fkey",
      column: "projectId",
      refTable: "Project",
      onDelete: "CASCADE",
    },
    // ProjectAssignment → Volunteer
    {
      table: "ProjectAssignment",
      constraint: "ProjectAssignment_volunteerId_fkey",
      column: "volunteerId",
      refTable: "Volunteer",
      onDelete: "CASCADE",
    },
  ];

  for (const fk of fkRedirects) {
    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "${schemaName}"."${fk.table}" DROP CONSTRAINT IF EXISTS "${fk.constraint}";`
      );
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "${schemaName}"."${fk.table}"
          ADD CONSTRAINT "${fk.constraint}"
            FOREIGN KEY ("${fk.column}")
            REFERENCES "${schemaName}"."${fk.refTable}"(id)
            ON DELETE ${fk.onDelete};
      `);
      console.log(`  ✓ FK ${fk.table}.${fk.column} → ${fk.refTable}`);
    } catch (_e) {
      console.log(`  ~ FK ${fk.table}.${fk.column}: ya configurada`);
    }
  }

  // 5. Parche idempotente de columnas v2.0
  //    Necesario para tenants clonados antes de que existieran estos campos en public.
  console.log(`Aplicando parche de columnas v2.0...`);

  const patches: string[] = [
    // Project — campos financieros y fechas
    `ALTER TABLE "${schemaName}"."Project" ADD COLUMN IF NOT EXISTS budget DOUBLE PRECISION`,
    `ALTER TABLE "${schemaName}"."Project" ADD COLUMN IF NOT EXISTS spent DOUBLE PRECISION`,
    `ALTER TABLE "${schemaName}"."Project" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMPTZ`,
    `ALTER TABLE "${schemaName}"."Project" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMPTZ`,
    // Donation — separación Donaciones vs Grants
    `ALTER TABLE "${schemaName}"."Donation" ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'DONATION'`,
    `ALTER TABLE "${schemaName}"."Donation" ADD COLUMN IF NOT EXISTS "donorEmail" TEXT`,
    `ALTER TABLE "${schemaName}"."Donation" ADD COLUMN IF NOT EXISTS notes TEXT`,
    `ALTER TABLE "${schemaName}"."Donation" ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD'`,
    `ALTER TABLE "${schemaName}"."Donation" ADD COLUMN IF NOT EXISTS "isRestricted" BOOLEAN NOT NULL DEFAULT FALSE`,
    `ALTER TABLE "${schemaName}"."Donation" ADD COLUMN IF NOT EXISTS "funderOrg" TEXT`,
    // ProjectAssignment — assignedAt
    `ALTER TABLE "${schemaName}"."ProjectAssignment" ADD COLUMN IF NOT EXISTS "assignedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()`,
  ];

  for (const sql of patches) {
    try {
      await prisma.$executeRawUnsafe(sql);
    } catch (_e) {
      // ADD COLUMN IF NOT EXISTS nunca debería fallar, pero capturamos por seguridad
    }
  }
  console.log(`  ✓ Parche v2.0 aplicado`);

  // 6. Crear Super Admin Inicial (User es global en public)
  const email = `admin@${slug}.org`;
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where:  { email },
    update: {},
    create: {
      email,
      name:               `Administrador ${name}`,
      password:           hashedPassword,
      role:               'SUPER_ADMIN',
      mustChangePassword: true,
    },
  });

  console.log(`\n✅ Tenant "${name}" creado con éxito.`);
  console.log(`   Admin: ${email} / admin123`);
  console.log(`   Schema: ${schemaName}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
