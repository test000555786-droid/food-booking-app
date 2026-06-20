"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionUser, Table, Order } from "@/types";
import { StaffNavbar } from "@/components/staff/StaffNavbar";
import { TableGrid } from "@/components/staff/TableGrid";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function StaffTablesPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          loadData(data.user.restaurantId);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const loadData = async (restaurantId: string) => {
    try {
      const [tablesRes, ordersRes] = await Promise.all([
        fetch("/api/tables"),
        fetch("/api/orders"),
      ]);

      if (tablesRes.ok) {
        const data = await tablesRes.json();
        setTables(data.tables || []);
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }
    } catch {
      // Handle error
    }
  };

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-bg">
      <StaffNavbar user={user} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-text mb-4">Table Overview</h2>
        <TableGrid tables={tables} orders={orders} />
      </main>
    </div>
  );
}
