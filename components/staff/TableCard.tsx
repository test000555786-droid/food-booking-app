"use client";

import { motion } from "framer-motion";
import { Table, Order } from "@/types";
import { formatTableName, formatPrice } from "@/lib/formatters";

interface TableCardProps {
  table: Table;
  activeOrders: Order[];
  onClick: (tableId: string) => void;
}

export function TableCard({ table, activeOrders, onClick }: TableCardProps) {
  const isOccupied = activeOrders.length > 0;
  const totalBill = activeOrders.reduce(
    (sum, order) =>
      sum +
      (order.items?.reduce((s, item) => s + Number(item.unitPrice) * item.quantity, 0) || 0),
    0
  );

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(table.id)}
      className={`relative p-4 rounded-2xl border text-left transition-colors ${
        isOccupied
          ? "bg-orange-50 border-orange-200 hover:bg-orange-100"
          : "bg-green-50 border-green-200 hover:bg-green-100"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-display font-bold text-text">
          {formatTableName(table.tableNumber)}
        </span>
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isOccupied ? "bg-orange-400" : "bg-green-400"
          }`}
        />
      </div>

      {table.label && (
        <p className="text-xs text-text-muted mb-1">{table.label}</p>
      )}

      {isOccupied ? (
        <div className="space-y-1">
          <p className="text-xs text-orange-700 font-medium">
            {activeOrders.length} active order{activeOrders.length > 1 ? "s" : ""}
          </p>
          <p className="text-sm font-semibold text-text tabular-nums">
            {formatPrice(totalBill)}
          </p>
        </div>
      ) : (
        <p className="text-xs text-green-700 font-medium">Available</p>
      )}
    </motion.button>
  );
}
