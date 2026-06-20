import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface MenuLayoutProps {
  children: React.ReactNode;
  params: { tableId: string };
}

async function getTableData(tableId: string) {
  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: { restaurant: true },
  });
  return { table };
}

export default async function MenuLayout({ children, params }: MenuLayoutProps) {
  const { table } = await getTableData(params.tableId);

  if (!table || !table.isActive) {
    notFound();
  }

  return <>{children}</>;
}
