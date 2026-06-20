"use client";

import { Table, Order } from "@/types";
import { TableCard } from "./TableCard";

interface TableGridProps {
  tables: Table[];
  orders: Order[];
  onTableClick?: (tableId: string) => void;
}

export function TableGrid({ tables, orders, onTableClick }: TableGridProps) {
  const getActiveOrdersForTable = (tableId: string): Order[] => {
    return orders.filter(
      (order) =>
        order.tableId === tableId &&
        order.status !== "SERVED" &&
        order.status !== "CANCELLED"
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {tables
        .sort((a, b) => a.tableNumber - b.tableNumber)
        .map((table) => (
          <TableCard
            key={table.id}
            table={table}
            activeOrders={getActiveOrdersForTable(table.id)}
            onClick={onTableClick || (() => {})}
          />
        ))}
    </div>
  );
}
