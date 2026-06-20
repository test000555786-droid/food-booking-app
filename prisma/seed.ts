import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Spice Garden",
      tagline: "Authentic Indian Flavors, Fresh Every Day",
      address: "42 Park Street, Bangalore, Karnataka 560001",
      phone: "+91 80 2558 7420",
    },
  });

  console.log("Created restaurant:", restaurant.name);

  // Create tables (1-10)
  const tables = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.table.create({
        data: {
          restaurantId: restaurant.id,
          tableNumber: i + 1,
          label: i === 0 ? "Window Seat" : i === 9 ? "Garden View" : null,
          isActive: true,
        },
      })
    )
  );

  console.log("Created", tables.length, "tables");

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { restaurantId: restaurant.id, name: "Starters", emoji: "🥟", sortOrder: 0 },
    }),
    prisma.category.create({
      data: { restaurantId: restaurant.id, name: "Main Course", emoji: "🍛", sortOrder: 1 },
    }),
    prisma.category.create({
      data: { restaurantId: restaurant.id, name: "Breads", emoji: "🫓", sortOrder: 2 },
    }),
    prisma.category.create({
      data: { restaurantId: restaurant.id, name: "Desserts", emoji: "🍮", sortOrder: 3 },
    }),
    prisma.category.create({
      data: { restaurantId: restaurant.id, name: "Beverages", emoji: "🥤", sortOrder: 4 },
    }),
  ]);

  console.log("Created", categories.length, "categories");

  // Create menu items
  const menuItemsData = [
    // Starters
    {
      name: "Paneer Tikka",
      description: "Cottage cheese cubes marinated in spiced yogurt, grilled to perfection",
      price: 349,
      isVeg: true,
      isBestseller: true,
      isSpicy: true,
      categoryIndex: 0,
    },
    {
      name: "Chicken Seekh Kebab",
      description: "Minced chicken with aromatic spices, cooked in tandoor",
      price: 399,
      isVeg: false,
      isBestseller: true,
      isSpicy: true,
      categoryIndex: 0,
    },
    {
      name: "Veg Spring Rolls",
      description: "Crispy rolls stuffed with fresh vegetables and served with sweet chili sauce",
      price: 249,
      isVeg: true,
      isBestseller: false,
      isSpicy: false,
      categoryIndex: 0,
    },
    {
      name: "Fish Amritsari",
      description: "Punjabi-style batter-fried fish with ajwain and carom seeds",
      price: 449,
      isVeg: false,
      isBestseller: false,
      isSpicy: true,
      categoryIndex: 0,
    },
    // Main Course
    {
      name: "Butter Chicken",
      description: "Tender chicken in rich tomato-butter gravy with fenugreek",
      price: 499,
      isVeg: false,
      isBestseller: true,
      isSpicy: false,
      categoryIndex: 1,
    },
    {
      name: "Palak Paneer",
      description: "Creamy spinach with fresh cottage cheese and tempered spices",
      price: 379,
      isVeg: true,
      isBestseller: true,
      isSpicy: false,
      categoryIndex: 1,
    },
    {
      name: "Dal Makhani",
      description: "Slow-cooked black lentils with cream and butter",
      price: 329,
      isVeg: true,
      isBestseller: true,
      isSpicy: false,
      categoryIndex: 1,
    },
    {
      name: "Rogan Josh",
      description: "Kashmiri-style lamb curry with aromatic spices",
      price: 549,
      isVeg: false,
      isBestseller: false,
      isSpicy: true,
      categoryIndex: 1,
    },
    {
      name: "Veg Biryani",
      description: "Fragrant basmati rice with garden vegetables and saffron",
      price: 349,
      isVeg: true,
      isBestseller: false,
      isSpicy: true,
      categoryIndex: 1,
    },
    {
      name: "Chicken Biryani",
      description: "Hyderabadi-style biryani with tender chicken and raita",
      price: 449,
      isVeg: false,
      isBestseller: true,
      isSpicy: true,
      categoryIndex: 1,
    },
    // Breads
    {
      name: "Butter Naan",
      description: "Soft leavened bread brushed with butter",
      price: 69,
      isVeg: true,
      isBestseller: true,
      isSpicy: false,
      categoryIndex: 2,
    },
    {
      name: "Garlic Naan",
      description: "Naan topped with fresh garlic and coriander",
      price: 89,
      isVeg: true,
      isBestseller: false,
      isSpicy: false,
      categoryIndex: 2,
    },
    {
      name: "Tandoori Roti",
      description: "Whole wheat flatbread baked in clay oven",
      price: 49,
      isVeg: true,
      isBestseller: false,
      isSpicy: false,
      categoryIndex: 2,
    },
    // Desserts
    {
      name: "Gulab Jamun",
      description: "Deep-fried milk dumplings soaked in cardamom sugar syrup",
      price: 149,
      isVeg: true,
      isBestseller: true,
      isSpicy: false,
      categoryIndex: 3,
    },
    {
      name: "Rasmalai",
      description: "Soft cottage cheese patties in saffron-infused milk",
      price: 179,
      isVeg: true,
      isBestseller: false,
      isSpicy: false,
      categoryIndex: 3,
    },
    // Beverages
    {
      name: "Mango Lassi",
      description: "Creamy yogurt drink with fresh mango pulp",
      price: 129,
      isVeg: true,
      isBestseller: true,
      isSpicy: false,
      categoryIndex: 4,
    },
    {
      name: "Masala Chai",
      description: "Spiced Indian tea with ginger and cardamom",
      price: 79,
      isVeg: true,
      isBestseller: false,
      isSpicy: false,
      categoryIndex: 4,
    },
    {
      name: "Fresh Lime Soda",
      description: "Refreshing lime juice with soda and mint",
      price: 99,
      isVeg: true,
      isBestseller: false,
      isSpicy: false,
      categoryIndex: 4,
    },
  ];

  await Promise.all(
    menuItemsData.map((item, index) =>
      prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: categories[item.categoryIndex].id,
          name: item.name,
          description: item.description,
          price: item.price,
          isVeg: item.isVeg,
          isAvailable: true,
          isBestseller: item.isBestseller,
          isSpicy: item.isSpicy,
          sortOrder: index,
        },
      })
    )
  );

  console.log("Created", menuItemsData.length, "menu items");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.staffUser.create({
    data: {
      restaurantId: restaurant.id,
      name: "Restaurant Admin",
      email: "admin@spicegarden.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Created admin:", admin.email, "/ password: admin123");

  // Create staff user
  const staffPassword = await bcrypt.hash("staff123", 12);
  const staff = await prisma.staffUser.create({
    data: {
      restaurantId: restaurant.id,
      name: "Kitchen Staff",
      email: "staff@spicegarden.com",
      passwordHash: staffPassword,
      role: "STAFF",
    },
  });

  console.log("Created staff:", staff.email, "/ password: staff123");

  // Create manager user
  const managerPassword = await bcrypt.hash("manager123", 12);
  const manager = await prisma.staffUser.create({
    data: {
      restaurantId: restaurant.id,
      name: "Floor Manager",
      email: "manager@spicegarden.com",
      passwordHash: managerPassword,
      role: "MANAGER",
    },
  });

  console.log("Created manager:", manager.email, "/ password: manager123");

  // Store restaurant ID for reference
  console.log("\n=== Restaurant ID for .env ===");
  console.log("NEXT_PUBLIC_RESTAURANT_ID=" + restaurant.id);
  console.log("=============================\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
