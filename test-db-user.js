const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const admin = await prisma.user.findFirst({
    where: { role: 'RESTAURANT_ADMIN' }
  });
  console.log('Admin user:', admin);
}
check().catch(console.error).finally(() => prisma.$disconnect());
