"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Order, OrderStatus } from "@/types";
import { OrderCard } from "./OrderCard";

interface OrderColumnProps {
  title: string;
  status: OrderStatus;
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  colorClass?: string;
}

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "border-t-amber-400",
  [OrderStatus.CONFIRMED]: "border-t-blue-400",
  [OrderStatus.PREPARING]: "border-t-orange-400",
  [OrderStatus.READY]: "border-t-green-400",
  [OrderStatus.SERVED]: "border-t-gray-300",
  [OrderStatus.CANCELLED]: "border-t-red-400",
};

export function OrderColumn({ title, status, orders, onStatusChange }: OrderColumnProps) {
  return (
    <div className={`flex flex-col bg-bg/50 rounded-2xl border border-border border-t-4 ${statusColors[status]} min-h-[400px]`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-text text-sm">{title}</h3>
        <span className="w-6 h-6 rounded-full bg-white border border-border flex items-center justify-center text-xs font-medium text-text">
          {orders.length}
        </span>
      </div>
      
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-xs text-text-muted">No orders</p>
            </motion.div>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
