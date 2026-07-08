"use client";

import { useAdminStore } from "@/store/adminStore";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, setIsSidebarOpen } = useAdminStore();

  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="lg:ml-64">
        {children}
      </div>
    </div>
  );
}
