const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const sessions = await prisma.tableSession.findMany({
    where: { tableId: 'cmr3rijpc0002icczbukjiz3n' },
    orderBy: { startedAt: 'desc' },
    take: 5
  });
  console.log('Sessions for Table 9:', sessions);
}
check().catch(console.error).finally(() => prisma.$disconnect());
