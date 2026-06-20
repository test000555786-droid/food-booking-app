"use client";

import { useState, useEffect, useCallback } from "react";
import { MenuItem, Category } from "@/types";

interface MenuData {
  categories: Category[];
  items: MenuItem[];
}

interface UseMenuReturn {
  data: MenuData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMenu(restaurantId?: string): UseMenuReturn {
  const [data, setData] = useState<MenuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = restaurantId
        ? `/api/menu?restaurantId=${restaurantId}`
        : "/api/menu";

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to load menu");
      }

      const menuData = await res.json();
      setData(menuData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menu");
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchMenu,
  };
}
