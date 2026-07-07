"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionUser, Category } from "@/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";

export default function NewMenuItemPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then(async (data) => {
        if (data.user) {
          setUser(data.user);
          await loadCategories(data.user.restaurantId);
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
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to create item");

    toast.success("Menu item created!");
    router.push("/admin/menu");
  };

  if (isLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) { router.push("/admin"); return null; }

  return (
    <div>
      <Toaster position="top-center" />
      <AdminHeader user={user} onMenuClick={() => {}} title="Add Menu Item" />
      <main className="p-4 max-w-lg">
        <div className="bg-surface rounded-2xl border border-border p-5">
          <MenuItemForm categories={categories} onSubmit={handleSubmit} onCancel={() => router.push("/admin/menu")} />
        </div>
      </main>
    </div>
  );
}
