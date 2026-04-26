const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando backup de la base de datos...');
  
  const backup = {
    timestamp: new Date().toISOString(),
    data: {
      users: await prisma.user.findMany(),
      projects: await prisma.project.findMany(),
      volunteers: await prisma.volunteer.findMany(),
      donations: await prisma.donation.findMany(),
      // auditLogs: await prisma.auditLog.findMany(), // Descomentar cuando el modelo exista
    }
  };

  const backupDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const fileName = `backup-${backup.timestamp.replace(/:/g, '-')}.json`;
  fs.writeFileSync(path.join(backupDir, fileName), JSON.stringify(backup, null, 2));

  console.log(`Backup completado: ${fileName}`);
}

main()
  .catch(e => {
    console.error('Error durante el backup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
