const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const sessions = await prisma.tableSession.findMany({
    orderBy: { startedAt: 'desc' },
    take: 2
  });
  console.log('Latest Sessions:', sessions);
}
check().catch(console.error).finally(() => prisma.$disconnect());
