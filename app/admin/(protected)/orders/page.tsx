"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionUser, Order } from "@/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderHistoryTable } from "@/components/admin/OrderHistoryTable";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          loadOrders(data.user.restaurantId);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [statusFilter]);

  const loadOrders = async (restaurantId: string) => {
    try {
      let url = `/api/orders?restaurantId=${restaurantId}&limit=200`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {
      // Handle error
    }
  };

  // Poll every 30 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      loadOrders(user.restaurantId);
    }, 30000);
    return () => clearInterval(interval);
  }, [user, statusFilter]);

  if (isLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) { router.push("/admin"); return null; }

  return (
    <div>
      <AdminHeader user={user} onMenuClick={() => {}} title="Order History" />
      <main className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border text-sm bg-white outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="SERVED">Served</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted">{orders.length} orders</span>
            <button
              onClick={() => user && loadOrders(user.restaurantId)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <OrderHistoryTable orders={orders} />
        </div>
      </main>
    </div>
  );
}
