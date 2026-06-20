"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionUser, Category } from "@/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoryList } from "@/components/admin/CategoryList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          loadCategories(data.user.restaurantId);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const loadCategories = async (restaurantId: string) => {
    try {
      const res = await fetch(`/api/categories?restaurantId=${restaurantId}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch {
      // Handle error
    }
  };

  const handleCreate = async (data: { name: string; emoji: string }) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newCat = await res.json();
      setCategories((prev) => [...prev, newCat]);
      setShowForm(false);
      toast.success("Category created!");
    }
  };

  const handleUpdate = async (id: string, data: Partial<Category>) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) { router.push("/admin"); return null; }

  return (
    <div>
      <Toaster position="top-center" />
      <AdminHeader user={user} onMenuClick={() => {}} title="Categories" />
      <main className="p-4 max-w-lg">
        <button onClick={() => setShowForm(!showForm)} className="mb-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-colors">
          + Add Category
        </button>
        {showForm && (
          <div className="mb-4 bg-surface rounded-2xl border border-border p-4">
            <CategoryForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}
        <CategoryList categories={categories} onUpdate={handleUpdate} onDelete={handleDelete} />
      </main>
    </div>
  );
}
