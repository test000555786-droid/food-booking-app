import { create } from "zustand";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  tableId: string | null;
  sessionId: string | null;
  isHydrated: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateNote: (menuItemId: string, note: string) => void;
  clearCart: () => void;
  setSession: (tableId: string, sessionId: string) => void;
  setHydrated: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const STORAGE_KEY = "tablescan-cart";

function loadFromStorage(): Partial<CartState> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

function saveToStorage(state: { items: CartItem[]; tableId: string | null; sessionId: string | null }): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    items: state.items,
    tableId: state.tableId,
    sessionId: state.sessionId,
  }));
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  tableId: null,
  sessionId: null,
  isHydrated: false,

  addItem: (item: CartItem) => {
    set((state) => {
      const existing = state.items.find((i) => i.menuItemId === item.menuItemId);
      let newItems: CartItem[];
      
      if (existing) {
        newItems = state.items.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + item.quantity, note: item.note || i.note }
            : i
        );
      } else {
        newItems = [...state.items, item];
      }
      
      const newState = { ...state, items: newItems };
      saveToStorage(newState);
      return newState;
    });
  },

  removeItem: (menuItemId: string) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.menuItemId !== menuItemId);
      const newState = { ...state, items: newItems };
      saveToStorage(newState);
      return newState;
    });
  },

  updateQuantity: (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId);
      return;
    }
    set((state) => {
      const newItems = state.items.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity } : i
      );
      const newState = { ...state, items: newItems };
      saveToStorage(newState);
      return newState;
    });
  },

  updateNote: (menuItemId: string, note: string) => {
    set((state) => {
      const newItems = state.items.map((i) =>
        i.menuItemId === menuItemId ? { ...i, note } : i
      );
      const newState = { ...state, items: newItems };
      saveToStorage(newState);
      return newState;
    });
  },

  clearCart: () => {
    set({ items: [], tableId: null, sessionId: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  setSession: (tableId: string, sessionId: string) => {
    set((state) => {
      const newState = { ...state, tableId, sessionId };
      saveToStorage(newState);
      return newState;
    });
  },

  setHydrated: () => set({ isHydrated: true }),

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));

// Hydrate store from localStorage on client
export function hydrateCart(): void {
  const stored = loadFromStorage();
  if (stored.items || stored.tableId || stored.sessionId) {
    useCartStore.setState({
      items: stored.items || [],
      tableId: stored.tableId || null,
      sessionId: stored.sessionId || null,
    });
  }
  useCartStore.setState({ isHydrated: true });
}
