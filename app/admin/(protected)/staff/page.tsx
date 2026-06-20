"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionUser, StaffUser } from "@/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StaffUserForm } from "@/components/admin/StaffUserForm";
import { StaffUserTable } from "@/components/admin/StaffUserTable";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";

export default function AdminStaffPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          loadStaff(data.user.restaurantId);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const loadStaff = async (restaurantId: string) => {
    try {
      const res = await fetch(`/api/staff-users?restaurantId=${restaurantId}`);
      if (res.ok) {
        const data = await res.json();
        setStaff(data.users || []);
      }
    } catch {
      // Handle error
    }
  };

  const handleCreate = async (data: { name: string; email: string; password: string; role: string }) => {
    const res = await fetch("/api/staff-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newUser = await res.json();
      setStaff((prev) => [...prev, newUser]);
      setShowForm(false);
      toast.success("Staff member added!");
    } else {
      throw new Error("Failed to create");
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    const res = await fetch(`/api/staff-users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    if (res.ok) {
      setStaff((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive } : u)));
      toast.success(isActive ? "Staff activated" : "Staff deactivated");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) { router.push("/admin"); return null; }

  return (
    <div>
      <Toaster position="top-center" />
      <AdminHeader user={user} onMenuClick={() => {}} title="Staff Management" />
      <main className="p-4 max-w-2xl">
        <button onClick={() => setShowForm(!showForm)} className="mb-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-xl transition-colors">
          + Add Staff Member
        </button>
        {showForm && (
          <div className="mb-4 bg-surface rounded-2xl border border-border p-5">
            <StaffUserForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden p-4">
          <StaffUserTable users={staff} onToggleActive={handleToggleActive} />
        </div>
      </main>
    </div>
  );
}
