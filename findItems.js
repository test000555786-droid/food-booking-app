const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const items = await prisma.menuItem.findMany({
    where: {
      OR: [
        { name: { contains: "Mandi" } },
        { name: { contains: "Water" } },
      ],
    },
  });
  console.log("Found items:");
  items.forEach(item => {
    console.log(`- ${item.id}: ${item.name} (${item.imageUrl})`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
