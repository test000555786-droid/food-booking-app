"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SessionUser, MenuItem, Category } from "@/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatPrice } from "@/lib/formatters";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import toast, { Toaster } from "react-hot-toast";

export default function AdminMenuPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          loadData();
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const loadData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch("/api/menu"),
        fetch("/api/categories"),
      ]);

      if (menuRes.ok) {
        const data = await menuRes.json();
        setItems(data.items || []);
      }
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data.categories || []);
      }
    } catch {
      // Handle error
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/menu/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== deleteId));
        toast.success("Item deleted");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !current }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, isAvailable: !current } : i))
        );
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || "Unknown";

  if (isLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) { router.push("/admin"); return null; }

  return (
    <div>
      <Toaster position="top-center" />
      <AdminHeader user={user} onMenuClick={() => setIsSidebarOpen(true)} title="Menu Management" />

      <main className="p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-text-muted">{items.length} items</p>
          <Link href="/admin/menu/new" className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-colors">
            + Add Item
          </Link>
        </div>

        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          {items.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm">No menu items yet</div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-bg/50">
                  <div className="w-12 h-12 rounded-xl bg-bg flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-text truncate">{item.name}</p>
                    <p className="text-xs text-text-muted">{getCategoryName(item.categoryId)} · {formatPrice(Number(item.price))}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAvailability(item.id, item.isAvailable)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.isAvailable ? "Active" : "Inactive"}
                    </button>
                    <Link href={`/admin/menu/${item.id}`} className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-bg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-text-muted hover:text-danger rounded-lg hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog isOpen={!!deleteId} title="Delete Item" message="Are you sure? This cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} variant="danger" />
    </div>
  );
}
