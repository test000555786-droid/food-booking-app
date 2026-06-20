"use client";

import { useCallback } from "react";
import { useCartStore, hydrateCart } from "@/store/cartStore";
import { CartItem } from "@/types";

export function useCart() {
  const store = useCartStore();

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      store.addItem({
        ...item,
        quantity: item.quantity || 1,
      });
    },
    [store]
  );

  const removeFromCart = useCallback(
    (menuItemId: string) => {
      store.removeItem(menuItemId);
    },
    [store]
  );

  const updateQuantity = useCallback(
    (menuItemId: string, quantity: number) => {
      store.updateQuantity(menuItemId, quantity);
    },
    [store]
  );

  const updateNote = useCallback(
    (menuItemId: string, note: string) => {
      store.updateNote(menuItemId, note);
    },
    [store]
  );

  const clearCart = useCallback(() => {
    store.clearCart();
  }, [store]);

  const setSession = useCallback(
    (tableId: string, sessionId: string) => {
      store.setSession(tableId, sessionId);
    },
    [store]
  );

  return {
    items: store.items,
    tableId: store.tableId,
    sessionId: store.sessionId,
    isHydrated: store.isHydrated,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateNote,
    clearCart,
    setSession,
    totalItems: store.getTotalItems(),
    totalPrice: store.getTotalPrice(),
  };
}

export { hydrateCart };
