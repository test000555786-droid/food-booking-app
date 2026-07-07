const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result1 = await prisma.menuItem.updateMany({
    where: { name: { contains: "Mandi" } },
    data: { imageUrl: "/images/Mix-Mandi-Thaal.webp" },
  });
  console.log(`Updated Mandi: ${result1.count} record(s)`);

  const result2 = await prisma.menuItem.updateMany({
    where: { name: { contains: "Water Bottle" } },
    data: { imageUrl: "/images/bottled-water.jpg" },
  });
  console.log(`Updated Water Bottle: ${result2.count} record(s)`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
