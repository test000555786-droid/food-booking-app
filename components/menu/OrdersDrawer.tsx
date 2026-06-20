"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Order } from "@/types";
import { OrderStatusTracker } from "./OrderStatusTracker";
import { formatPrice } from "@/lib/formatters";
import toast from "react-hot-toast";

interface OrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  restaurantId: string;
  tableId: string;
}

export function OrdersDrawer({ isOpen, onClose, sessionId, restaurantId, tableId }: OrdersDrawerProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingBill, setIsRequestingBill] = useState(false);

  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const fetchOrders = (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      fetch(`/api/orders?sessionId=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) {
            setOrders(data.orders);
          }
        })
        .finally(() => {
          if (showLoading) setIsLoading(false);
        });
    };

    // Initial fetch
    fetchOrders(true);

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, sessionId]);

  const handleRequestBill = async () => {
    if (isRequestingBill) return;
    setIsRequestingBill(true);

    try {
      const res = await fetch("/api/waiter-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId, type: "BILL" }),
      });

      if (!res.ok) throw new Error("Failed to request bill");

      toast.success("Bill request sent! A waiter will be with you shortly.");
      onClose();
    } catch {
      toast.error("Failed to request bill. Please try again.");
    } finally {
      setIsRequestingBill(false);
    }
  };

  const calculateTotal = () => {
    return orders.reduce((total, order) => {
      if (order.status === "CANCELLED") return total;
      const orderTotal = order.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
      return total + orderTotal;
    }, 0);
  };

  const subtotal = calculateTotal();
  // Using 5% as a dummy tax for display purposes, could be fetched from backend if needed
  const tax = subtotal * 0.05; 
  const total = subtotal + tax;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="orders-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-bg rounded-t-3xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-surface rounded-t-3xl border-b border-border shadow-sm z-10">
              <div>
                <h2 className="font-display text-xl font-bold text-text">My Orders</h2>
                <p className="text-xs text-text-muted">Live status of your tab</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-bg flex items-center justify-center hover:bg-border transition-colors"
              >
                <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-text-muted">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-text-muted text-sm">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <OrderStatusTracker initialOrders={orders} restaurantId={restaurantId} />
              )}
            </div>

            {/* Bill Summary & Action */}
            {orders.length > 0 && !isLoading && (
              <div className="bg-surface border-t border-border p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="space-y-2 mb-4 px-2">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Taxes & Fees (Est.)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-text pt-2 border-t border-border">
                    <span>Total Bill</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleRequestBill}
                  disabled={isRequestingBill}
                  className="w-full py-3.5 flex items-center justify-center gap-2 bg-text hover:bg-black text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {isRequestingBill ? "Requesting..." : "Request Bill to Table"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
