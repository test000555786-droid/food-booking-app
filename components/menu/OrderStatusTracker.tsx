"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { OrderStatus, Order } from "@/types";
import { formatOrderNumber, formatRelativeTime } from "@/lib/formatters";
import { getRestaurantChannel } from "@/lib/pusher-client";

interface OrderStatusTrackerProps {
  initialOrders: Order[];
  restaurantId: string;
}

const statusSteps: { status: OrderStatus; label: string }[] = [
  { status: OrderStatus.PENDING, label: "Pending" },
  { status: OrderStatus.CONFIRMED, label: "Confirmed" },
  { status: OrderStatus.PREPARING, label: "Preparing" },
  { status: OrderStatus.READY, label: "Ready" },
  { status: OrderStatus.SERVED, label: "Served" },
];

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-amber-100 text-amber-800",
  [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800",
  [OrderStatus.PREPARING]: "bg-orange-100 text-orange-800",
  [OrderStatus.READY]: "bg-green-100 text-green-800",
  [OrderStatus.SERVED]: "bg-gray-100 text-gray-600",
  [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
};

function OrderCard({ order }: { order: Order }) {
  const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status);
  const isCancelled = order.status === OrderStatus.CANCELLED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl border border-border p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-display font-bold text-text">
            {formatOrderNumber(order.orderNumber)}
          </span>
          <span className="text-xs text-text-muted ml-2">
            {formatRelativeTime(order.createdAt)}
          </span>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
        </span>
      </div>

      {isCancelled ? (
        <p className="text-sm text-danger">This order has been cancelled.</p>
      ) : (
        <div className="flex items-center gap-1">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.status} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full h-1.5 rounded-full transition-colors ${
                    isCompleted ? "bg-success" : "bg-border"
                  }`}
                />
                {isCurrent && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-medium text-success"
                  >
                    {step.label}
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {order.items && order.items.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-text-muted mb-1">Items:</p>
          {order.items.map((item) => (
            <p key={item.id} className="text-xs text-text">
              {item.quantity}x {item.menuItem?.name || "Item"}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function OrderStatusTracker({ initialOrders, restaurantId }: OrderStatusTrackerProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // Sync when parent data changes (e.g. from polling)
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!restaurantId) return;

    const channel = getRestaurantChannel(restaurantId);

    channel.bind("order-updated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    });

    return () => {
      channel.unbind("order-updated");
    };
  }, [restaurantId]);

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-text-muted">No active orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
