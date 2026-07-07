const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const updates = [
    // Starters
    { name: "Paneer Tikka",         image: "/images/paneer-tikka.webp" },
    { name: "Chicken Seekh Kebab",  image: "/images/chicken.seekh.webp" },
    { name: "Veg Spring Rolls",     image: null }, // no image provided, keep existing
    { name: "Fish Amritsari",       image: null }, // no image provided, keep existing

    // Main Course
    { name: "Butter Chicken",       image: "/images/butter-chicken.webp" },
    { name: "Palak Paneer",         image: "/images/palak-paneer.png" },
    { name: "Dal Makhani",          image: "/images/dal-makhani.png" },
    { name: "Rogan Josh",           image: null }, // no image provided, keep existing
    { name: "Veg Biryani",          image: null }, // no image provided, keep existing
    { name: "Chicken Biryani",      image: "/images/Chicken-biryani.webp" },

    // Breads
    { name: "Butter Naan",          image: "/images/butter-naan.webp" },
    { name: "Garlic Naan",          image: "/images/Garlic-naan.webp" },
    { name: "Tandoori Roti",        image: "/images/Tandoori-Roti-500x500.webp" },

    // Desserts
    { name: "Gulab Jamun",          image: "/images/gulab-jamun.webp" },
    { name: "Rasmalai",             image: "/images/Rasmalai.webp" },

    // Beverages
    { name: "Mango Lassi",          image: "/images/mango-lassi.webp" },
    { name: "Masala Chai",          image: "/images/Masala-chai.webp" },
    { name: "Fresh Lime Soda",      image: "/images/lemon-soda.webp" },
  ];

  for (const item of updates) {
    if (item.image === null) {
      console.log(`Skipping ${item.name} — no image provided`);
      continue;
    }
    const result = await prisma.menuItem.updateMany({
      where: { name: item.name },
      data: { imageUrl: item.image },
    });
    console.log(`✅ Updated "${item.name}": ${result.count} record(s) → ${item.image}`);
  }

  console.log("\nDone!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
