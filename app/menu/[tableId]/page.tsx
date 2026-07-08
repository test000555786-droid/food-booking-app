import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MenuShell } from "@/components/menu/MenuShell";
import { Toaster } from "react-hot-toast";

export const dynamic = "force-dynamic";

interface MenuPageProps {
  params: { tableId: string };
}

async function getMenuPageData(tableId: string) {
  if (tableId === "preview") {
    const restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) return null;
    return {
      table: { tableNumber: 0, label: "Demo Preview" },
      restaurant,
      isDemoMode: true
    };
  }

  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: { restaurant: true },
  });

  if (!table) return null;

  return { table, restaurant: table.restaurant, isDemoMode: false };
}

export default async function MenuPage({ params }: MenuPageProps) {
  const data = await getMenuPageData(params.tableId);

  if (!data) {
    notFound();
  }

  const { table, restaurant, isDemoMode } = data;

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1A1A18",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
      <MenuShell
        tableId={params.tableId}
        restaurant={{ id: restaurant.id, name: restaurant.name, tagline: restaurant.tagline }}
        table={{ tableNumber: table.tableNumber, label: table.label }}
        isDemoMode={isDemoMode}
      />
    </>
  );
}
