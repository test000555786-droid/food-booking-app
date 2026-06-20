"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionUser, Table } from "@/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TableForm } from "@/components/admin/TableForm";
import { QRCodeDisplay } from "@/components/admin/QRCodeDisplay";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";

export default function AdminTablesPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          loadTables(data.user.restaurantId);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const loadTables = async (restaurantId: string) => {
    try {
      const res = await fetch(`/api/tables?restaurantId=${restaurantId}`);
      if (res.ok) {
        const data = await res.json();
        setTables(data.tables || []);
      }
    } catch {
      // Handle error
    }
  };

  const handleCreate = async (data: { tableNumber: number; label: string }) => {
    const res = await fetch("/api/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newTable = await res.json();
      setTables((prev) => [...prev, newTable].sort((a, b) => a.tableNumber - b.tableNumber));
      setShowForm(false);
      toast.success("Table created!");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) { router.push("/admin"); return null; }

  return (
    <div>
      <Toaster position="top-center" />
      <AdminHeader user={user} onMenuClick={() => {}} title="Tables & QR Codes" />
      <main className="p-4">
        <button onClick={() => setShowForm(!showForm)} className="mb-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-colors">
          + Add Table
        </button>
        {showForm && (
          <div className="mb-4 bg-surface rounded-2xl border border-border p-4 max-w-md">
            <TableForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <QRCodeDisplay key={table.id} tableId={table.id} tableNumber={table.tableNumber} label={table.label} />
          ))}
        </div>
      </main>
    </div>
  );
}
