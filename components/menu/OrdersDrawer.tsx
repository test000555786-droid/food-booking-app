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

    let isActive = true;

    const fetchOrders = (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      fetch(`/api/orders?sessionId=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (isActive && data.orders) {
            setOrders(data.orders);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch orders:", err);
        })
        .finally(() => {
          if (isActive && showLoading) setIsLoading(false);
        });
    };

    // Initial fetch
    fetchOrders(true);

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 30000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
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
      const orderTotal = (order.items ?? []).reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
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
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl max-h-[90vh] flex flex-col"
            style={{ background: "var(--canvas)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 rounded-t-2xl z-10"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <div>
                <h2
                  className="font-display text-xl"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  My Orders
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
                >
                  Live status of your tab
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "var(--card)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: "var(--ink)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div
                    className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-3"
                    style={{ borderColor: "var(--spice)", borderTopColor: "transparent" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
                  >
                    Loading your orders…
                  </p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <p
                    className="text-sm"
                    style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
                  >
                    You haven&apos;t placed any orders yet.
                  </p>
                </div>
              ) : (
                <OrderStatusTracker initialOrders={orders} restaurantId={restaurantId} />
              )}
            </div>

            {/* Bill Summary & Action */}
            {orders.length > 0 && !isLoading && (
              <div
                className="p-4"
                style={{ borderTop: "1px solid var(--line)", background: "var(--canvas)" }}
              >
                {/* Price rows */}
                <div className="space-y-2 mb-4 px-1">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}>
                      Subtotal
                    </span>
                    <span
                      className="font-mono"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-mono)" }}
                    >
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}>
                      Taxes &amp; Fees (Est.)
                    </span>
                    <span
                      className="font-mono"
                      style={{ color: "var(--ink-muted)", fontFamily: "var(--font-mono)" }}
                    >
                      {formatPrice(tax)}
                    </span>
                  </div>
                  <div
                    className="flex justify-between pt-2"
                    style={{ borderTop: "1px solid var(--line)" }}
                  >
                    <span
                      className="font-medium"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-work-sans)" }}
                    >
                      Total Bill
                    </span>
                    <span
                      className="font-mono text-lg font-medium"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-mono)" }}
                    >
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Request Bill CTA */}
                <button
                  onClick={handleRequestBill}
                  disabled={isRequestingBill}
                  className="w-full py-3.5 flex items-center justify-center gap-2 rounded-xl font-medium transition-opacity disabled:opacity-50 text-sm"
                  style={{
                    background: "var(--ink)",
                    color: "var(--canvas)",
                    fontFamily: "var(--font-work-sans)",
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {isRequestingBill ? "Requesting…" : "Request Bill to Table"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
