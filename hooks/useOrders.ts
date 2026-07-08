"use client";

import { useState, useEffect, useCallback } from "react";
import { Order, OrderStatus } from "@/types";
import { getRestaurantChannel, unsubscribeFromChannel } from "@/lib/pusher-client";

interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  removeItem: (orderId: string, itemId: string) => Promise<void>;
}

export function useOrders(restaurantId: string): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and 30s polling
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Pusher subscription for real-time updates
  useEffect(() => {
    if (!restaurantId) return;

    const channel = getRestaurantChannel(restaurantId);

    channel.bind("new-order", (order: Order) => {
      setOrders((prev) => {
        if (prev.find((o) => o.id === order.id)) return prev;
        return [order, ...prev];
      });
    });

    channel.bind("order-updated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
    });

    return () => {
      channel.unbind("new-order");
      channel.unbind("order-updated");
      unsubscribeFromChannel(restaurantId);
    };
  }, [restaurantId]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
    } catch (err) {
      throw err;
    }
  };

  const removeItem = async (orderId: string, itemId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/items/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove item");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
    } catch (err) {
      throw err;
    }
  };

  return {
    orders,
    isLoading,
    error,
    refresh: fetchOrders,
    updateStatus,
    removeItem,
  };
}
