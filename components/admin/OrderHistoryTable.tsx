"use client";

import { Order } from "@/types";
import { formatOrderNumber, formatDateTime, formatPrice } from "@/lib/formatters";
import { OrderStatusBadge } from "../staff/OrderStatusBadge";

interface OrderHistoryTableProps {
  orders: Order[];
}

export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted text-sm">No orders found</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Order</th>
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Table</th>
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Items</th>
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Total</th>
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Status</th>
            <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-3 py-2">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => {
            const total = order.items?.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0) || 0;
            return (
              <tr key={order.id} className="hover:bg-bg/50">
                <td className="px-3 py-3 text-sm font-medium text-text">{formatOrderNumber(order.orderNumber)}</td>
                <td className="px-3 py-3 text-sm text-text-muted">{order.table?.tableNumber || "-"}</td>
                <td className="px-3 py-3 text-sm text-text-muted">{order.items?.length || 0} items</td>
                <td className="px-3 py-3 text-sm font-medium text-text tabular-nums">{formatPrice(total)}</td>
                <td className="px-3 py-3"><OrderStatusBadge status={order.status} /></td>
                <td className="px-3 py-3 text-xs text-text-muted">{formatDateTime(order.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
