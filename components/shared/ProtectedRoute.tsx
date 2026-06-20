"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { StaffRole } from "@/types";
import { LoadingSpinner } from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: StaffRole;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, hasAccess } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const loginPath = pathname.startsWith("/admin") ? "/admin" : "/staff";
      router.push(loginPath);
      return;
    }

    if (requiredRole && !hasAccess(requiredRole)) {
      router.push(user?.role === StaffRole.STAFF ? "/staff/dashboard" : "/admin/dashboard");
      return;
    }
  }, [isLoading, isAuthenticated, requiredRole, hasAccess, pathname, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  if (requiredRole && !hasAccess(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-text mb-2">Access Denied</h2>
          <p className="text-sm text-text-muted">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
