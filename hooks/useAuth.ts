"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StaffRole, type SessionUser } from "@/types";

interface UseAuthReturn {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  hasAccess: (requiredRole: StaffRole) => boolean;
}

export function useAuth(redirectTo?: string): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      // Session check failed
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Login failed" };
      }

      setUser(data.user);
      
      if (redirectTo) {
        router.push(redirectTo);
      } else if (data.user.role === StaffRole.STAFF) {
        router.push("/staff/dashboard");
      } else {
        router.push("/admin/dashboard");
      }

      return {};
    } catch {
      return { error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
    } catch {
      // Logout failed
    }
  };

  const hasAccess = useCallback(
    (requiredRole: StaffRole): boolean => {
      if (!user) return false;
      const hierarchy: Record<StaffRole, number> = {
        [StaffRole.STAFF]: 0,
        [StaffRole.MANAGER]: 1,
        [StaffRole.ADMIN]: 2,
      };
      return hierarchy[user.role] >= hierarchy[requiredRole];
    },
    [user]
  );

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasAccess,
  };
}
