"use client";

import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SessionUser, Order, OrderStatus } from "@/types";
import { StaffNavbar } from "@/components/staff/StaffNavbar";
import { OrderColumn } from "@/components/staff/OrderColumn";
import { WaiterAlertBanner } from "@/components/staff/WaiterAlertBanner";
import { SoundAlert } from "@/components/staff/SoundAlert";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useOrders } from "@/hooks/useOrders";
import { useWaiterCalls } from "@/hooks/useWaiterCalls";
import { getRestaurantChannel } from "@/lib/pusher-client";

const ORDER_STATUSES: { status: OrderStatus; title: string }[] = [
  { status: OrderStatus.PENDING, title: "Pending" },
  { status: OrderStatus.CONFIRMED, title: "Confirmed" },
  { status: OrderStatus.PREPARING, title: "Preparing" },
  { status: OrderStatus.READY, title: "Ready" },
];

export default function StaffDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Fetch user session
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setRestaurantId(data.user.restaurantId);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingUser(false));
  }, []);

  const { orders, isLoading: isLoadingOrders, updateStatus, removeItem, refresh } = useOrders(restaurantId);
  const { unresolvedCalls, resolveCall } = useWaiterCalls(restaurantId);

  // Subscribe to real-time updates (keep channel alive for the page lifetime)
  useEffect(() => {
    if (!restaurantId) return;
    // Just subscribing here keeps the shared Pusher channel active.
    // useOrders and useWaiterCalls each bind their own event handlers.
    getRestaurantChannel(restaurantId);
  }, [restaurantId]);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    router.push("/staff");
    return null;
  }

  const getOrdersByStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status);

  return (
    <div className="min-h-screen bg-bg">
      <StaffNavbar user={user} alertCount={unresolvedCalls.length} />
      <SoundAlert playTrigger={orders.length} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Waiter Alerts */}
        {unresolvedCalls.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-text mb-3">Active Alerts</h2>
            <WaiterAlertBanner calls={unresolvedCalls} onResolve={resolveCall} />
          </div>
        )}

        {/* Order Board */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Order Board</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-muted">{orders.length} active orders</span>
              <button
                onClick={refresh}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {isLoadingOrders ? (
            <LoadingSpinner label="Loading orders..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ORDER_STATUSES.map(({ status, title }) => (
                <OrderColumn
                  key={status}
                  title={title}
                  status={status}
                  orders={getOrdersByStatus(status)}
                  onStatusChange={updateStatus}
                  onRemoveItem={removeItem}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
