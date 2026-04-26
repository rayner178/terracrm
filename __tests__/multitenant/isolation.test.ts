import { prisma } from "../../src/infrastructure/database/prisma";
import { PrismaClient } from "@prisma/client";

// Usamos el cliente base para el setup para no estar sujetos al middleware de tenant automático
const basePrisma = new PrismaClient();

describe("Cross-Tenant Data Isolation", () => {
  beforeAll(async () => {
    // 1. Setup de Schemas para Tenants de Prueba
    const tenants = ["test_fundemar", "test_other"];
    for (const slug of tenants) {
      await basePrisma.tenant.upsert({
        where: { slug },
        update: {},
        create: { slug, name: `Tenant ${slug}` }
      });
      await basePrisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "tenant_${slug}"`);
      await basePrisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "tenant_${slug}"."Project" (LIKE public."Project" INCLUDING ALL)`);
    }

    // 2. Insertar datos en tenant_fundemar
    process.env.TEST_TENANT_SLUG = "test_fundemar";
    await prisma.project.deleteMany();
    await prisma.project.create({
      data: {
        id: "proj-1",
        name: "Proyecto Coral",
        description: "Fundemar",
        status: "ACTIVE"
      }
    });

    // 3. Insertar datos en tenant_other
    process.env.TEST_TENANT_SLUG = "test_other";
    await prisma.project.deleteMany();
    await prisma.project.create({
      data: {
        id: "proj-2",
        name: "Proyecto Bosque",
        description: "Otra ONG",
        status: "ACTIVE"
      }
    });
  });

  afterAll(async () => {
    await basePrisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS "tenant_test_fundemar" CASCADE');
    await basePrisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS "tenant_test_other" CASCADE');
    await basePrisma.$disconnect();
  });

  it("Debe aislar las consultas al tenant_test_fundemar", async () => {
    // Simulamos que la request viene de fundemar
    process.env.TEST_TENANT_SLUG = "test_fundemar";
    
    // Usamos el cliente con extensión
    const projects = await prisma.project.findMany();
    
    expect(projects.length).toBe(1);
    expect(projects[0].id).toBe("proj-1");
    expect(projects[0].name).toBe("Proyecto Coral");
  });

  it("Debe aislar las consultas al tenant_test_other", async () => {
    // Simulamos que la request viene del otro tenant
    process.env.TEST_TENANT_SLUG = "test_other";
    
    // Usamos el cliente con extensión
    const projects = await prisma.project.findMany();
    
    expect(projects.length).toBe(1);
    expect(projects[0].id).toBe("proj-2");
    expect(projects[0].name).toBe("Proyecto Bosque");
  });

  it("Debe lanzar error si no hay tenant definido en contexto protegido", async () => {
    delete process.env.TEST_TENANT_SLUG;
    
    await expect(prisma.project.findMany()).rejects.toThrow(/Acceso denegado/);
  });
});
