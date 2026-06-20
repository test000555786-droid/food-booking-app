"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Order, OrderStatus } from "@/types";
import { formatOrderNumber, formatTableName, formatRelativeTime, formatPrice } from "@/lib/formatters";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

const nextStatusMap: Record<OrderStatus, { label: string; next: OrderStatus | null; variant: string }> = {
  [OrderStatus.PENDING]: { label: "Confirm", next: OrderStatus.CONFIRMED, variant: "bg-blue-600 hover:bg-blue-700" },
  [OrderStatus.CONFIRMED]: { label: "Start Preparing", next: OrderStatus.PREPARING, variant: "bg-orange-600 hover:bg-orange-700" },
  [OrderStatus.PREPARING]: { label: "Mark Ready", next: OrderStatus.READY, variant: "bg-green-600 hover:bg-green-700" },
  [OrderStatus.READY]: { label: "Mark Served", next: OrderStatus.SERVED, variant: "bg-gray-600 hover:bg-gray-700" },
  [OrderStatus.SERVED]: { label: "Served", next: null, variant: "bg-gray-400" },
  [OrderStatus.CANCELLED]: { label: "Cancelled", next: null, variant: "bg-red-400" },
};

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const statusConfig = nextStatusMap[order.status];

  const handleStatusChange = async () => {
    if (!statusConfig.next || isUpdating) return;
    setIsUpdating(true);
    try {
      await onStatusChange(order.id, statusConfig.next);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onStatusChange(order.id, OrderStatus.CANCELLED);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-surface rounded-2xl border border-border shadow-sm p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-text">
            {formatOrderNumber(order.orderNumber)}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <span className="text-xs text-text-muted">{formatRelativeTime(order.createdAt)}</span>
      </div>

      {/* Table */}
      <div className="flex items-center gap-1 text-sm text-text-muted mb-2">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        {order.table ? formatTableName(order.table.tableNumber, order.table.label) : `Table`}
      </div>

      {/* Items */}
      <div className="space-y-1.5 mb-3">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-start justify-between text-sm">
            <div className="flex-1">
              <span className="text-text">{item.quantity}x {item.menuItem?.name || "Item"}</span>
              {item.note && (
                <p className="text-xs text-text-muted italic">Note: {item.note}</p>
              )}
            </div>
            <span className="text-text-muted tabular-nums ml-2">
              {formatPrice(Number(item.unitPrice) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-2 border-t border-border mb-3">
        <span className="text-sm text-text-muted">Total</span>
        <span className="font-semibold text-text tabular-nums">
          {formatPrice(order.items?.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0) || 0)}
        </span>
      </div>

      {/* Special Request */}
      {order.specialRequest && (
        <div className="mb-3 p-2 bg-amber-50 rounded-lg text-xs text-amber-800">
          <span className="font-medium">Special Request:</span> {order.specialRequest}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {statusConfig.next && (
          <button
            onClick={handleStatusChange}
            disabled={isUpdating}
            className={`flex-1 py-2 rounded-xl text-white text-sm font-medium transition-colors ${statusConfig.variant} disabled:opacity-50`}
          >
            {isUpdating ? "Updating..." : statusConfig.label}
          </button>
        )}
        
        {(order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED) && (
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className="px-3 py-2 rounded-xl border border-danger text-danger hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
}
