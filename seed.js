const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@terracrm.org' },
    update: {},
    create: {
      email: 'admin@terracrm.org',
      name: 'Administrador ONG',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });
  
  console.log('Creando definiciones de métricas de impacto...');
  await prisma.metricDefinition.createMany({
    data: [
      { name: 'Hectáreas Restauradas', unit: 'ha', category: 'TERRESTRE', description: 'Área total restaurada' },
      { name: 'Arrecife Monitoreado', unit: 'km2', category: 'MARINO', description: 'Área de arrecife de coral bajo monitoreo activo' },
      { name: 'Especies Registradas', unit: 'cantidad', category: 'TERRESTRE', description: 'Número de especies distintas catalogadas' },
      { name: 'CO2 Capturado', unit: 'toneladas', category: 'TERRESTRE', description: 'Toneladas de dióxido de carbono equivalente secuestradas' },
      { name: 'Beneficiarios Comunitarios', unit: 'personas', category: 'COMUNITARIO', description: 'Personas de la comunidad impactadas positivamente' },
      { name: 'Horas Voluntariado', unit: 'horas', category: 'COMUNITARIO', description: 'Total de horas aportadas por voluntarios' }
    ],
    skipDuplicates: true
  });

  console.log('Seed ejecutado correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
