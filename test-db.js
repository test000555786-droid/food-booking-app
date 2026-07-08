const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const calls = await prisma.waiterCall.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  console.log('Latest Call:', calls[0]);
}
check().catch(console.error).finally(() => prisma.$disconnect());
