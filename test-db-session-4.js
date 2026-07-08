const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const sessions = await prisma.tableSession.findMany({
    orderBy: { startedAt: 'desc' },
    take: 3
  });
  console.log('Latest sessions:', sessions);
}
check().catch(console.error).finally(() => prisma.$disconnect());
