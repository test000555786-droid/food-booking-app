const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const tables = await prisma.table.findMany({
    where: { tableNumber: 9 }
  });
  console.log('Tables with number 9:', tables);
  
  const sessions = await prisma.tableSession.findMany({
    orderBy: { startedAt: 'desc' },
    take: 5
  });
  console.log('Latest 5 sessions:', sessions);
}
check().catch(console.error).finally(() => prisma.$disconnect());
