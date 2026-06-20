"use client";

import { OrderStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-amber-100 text-amber-800",
  [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800",
  [OrderStatus.PREPARING]: "bg-orange-100 text-orange-800",
  [OrderStatus.READY]: "bg-green-100 text-green-800",
  [OrderStatus.SERVED]: "bg-gray-100 text-gray-600",
  [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
