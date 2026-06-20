"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { SessionUser, Category, MenuItem } from "@/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";

export default function EditMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.itemId as string;

  const [user, setUser] = useState<SessionUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [item, setItem] = useState<MenuItem | null>(null);
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
  }, [itemId]);

  const loadData = async (restaurantId: string) => {
    try {
      const [itemRes, catRes] = await Promise.all([
        fetch(`/api/menu/${itemId}`),
        fetch(`/api/categories?restaurantId=${restaurantId}`),
      ]);

      if (itemRes.ok) {
        const data = await itemRes.json();
        setItem(data);
      }
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data.categories || []);
      }
    } catch {
      // Handle error
    }
  };

  const handleSubmit = async (formData: {
    name: string;
    description: string;
    price: string;
    categoryId: string;
    isVeg: boolean;
    isAvailable: boolean;
    isBestseller: boolean;
    isSpicy: boolean;
    imageUrl: string;
  }) => {
    const res = await fetch(`/api/menu/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to update item");

    toast.success("Menu item updated!");
    router.push("/admin/menu");
  };

  if (isLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) { router.push("/admin"); return null; }

  return (
    <div>
      <Toaster position="top-center" />
      <AdminHeader user={user} onMenuClick={() => {}} title="Edit Menu Item" />
      <main className="p-4 max-w-lg">
        <div className="bg-surface rounded-2xl border border-border p-5">
          <MenuItemForm categories={categories} initialData={item} onSubmit={handleSubmit} onCancel={() => router.push("/admin/menu")} />
        </div>
      </main>
    </div>
  );
}
