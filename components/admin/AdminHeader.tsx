"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";
import { SessionUser } from "@/types";

interface AdminHeaderProps {
  user: SessionUser;
  onMenuClick?: () => void; // Made optional since it's now handled internally
  title?: string;
}

export function AdminHeader({ user, title }: AdminHeaderProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const setIsSidebarOpen = useAdminStore((state) => state.setIsSidebarOpen);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-bg flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {title && <h1 className="font-display text-lg font-semibold text-text">{title}</h1>}
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh */}
          <button
            onClick={() => router.refresh()}
            className="w-9 h-9 rounded-xl bg-bg flex items-center justify-center hover:bg-border transition-colors"
            title="Refresh"
          >
            <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-bg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 mt-1 w-48 bg-surface rounded-xl border border-border shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-text">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
