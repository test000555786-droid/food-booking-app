const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const updates = [
    { name: "Paneer Tikka", image: "/menu/paneer_tikka.png" },
    { name: "Chicken Seekh Kebab", image: "/menu/chicken_seekh_kebab.png" },
    { name: "Veg Spring Rolls", image: "/menu/veg_spring_rolls.png" },
    { name: "Fish Amritsari", image: "/menu/fish_amritsari.png" },
    { name: "Butter Chicken", image: "/menu/butter_chicken.png" },
    { name: "Palak Paneer", image: "/menu/palak_paneer.png" },
    { name: "Dal Makhani", image: "/menu/dal_makhani.png" },
    { name: "Rogan Josh", image: "/menu/rogan_josh.png" },
    { name: "Veg Biryani", image: "/menu/veg_biryani.png" },
  ];

  for (const item of updates) {
    const updated = await prisma.menuItem.updateMany({
      where: { name: item.name },
      data: { imageUrl: item.image },
    });
    console.log(`Updated ${item.name}: ${updated.count} record(s)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
