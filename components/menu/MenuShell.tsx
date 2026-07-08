"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MenuItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { formatTableName } from "@/lib/formatters";
import { hydrateCart } from "@/store/cartStore";
import { CategoryTabs } from "./CategoryTabs";
import { SearchBar } from "./SearchBar";
import { MenuItemGrid } from "./MenuItemGrid";
import { ItemDetailModal } from "./ItemDetailModal";
import { CartDrawer } from "./CartDrawer";
import { CartFab } from "./CartFab";
import { WaiterCallButton } from "./WaiterCallButton";
import { OrdersDrawer } from "./OrdersDrawer";
import { OrdersFab } from "./OrdersFab";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { useTableSession } from "@/hooks/useTableSession";
import { useMenu } from "@/hooks/useMenu";

interface MenuShellProps {
  tableId: string;
  restaurant: {
    id: string;
    name: string;
    tagline?: string | null;
  };
  table: {
    tableNumber: number;
    label?: string | null;
  };
  isDemoMode?: boolean;
}

export function MenuShell({ tableId, restaurant, table, isDemoMode = false }: MenuShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: menuData, isLoading } = useMenu(restaurant.id);
  const { totalItems, totalPrice, addToCart } = useCart();
  const { session, isLoading: isSessionLoading, startSession, endSession } = useTableSession(tableId);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [billSettled, setBillSettled] = useState(false);

  // Hydrate cart on mount
  useEffect(() => {
    hydrateCart();
  }, []);

  // Start session if not exists (skip in demo mode)
  useEffect(() => {
    if (!isDemoMode && !session && !isSessionLoading) {
      startSession(tableId).catch(() => {
        // Session may already exist
      });
    }
  }, [isDemoMode, session, isSessionLoading, tableId, startSession]);

  // Filter items by category and search
  const filteredItems = useMemo(() => {
    if (!menuData) return [];

    let items = menuData.items;

    if (selectedCategory) {
      items = items.filter((item) => item.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // Sort: bestsellers first, then available
    return [...items].sort((a, b) => {
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      if (a.isAvailable && !b.isAvailable) return -1;
      if (!a.isAvailable && b.isAvailable) return 1;
      return 0;
    });
  }, [menuData, selectedCategory, searchQuery]);

  // Get visible categories
  const categories = useMemo(() => {
    if (!menuData) return [];
    return menuData.categories.filter((c) => c.isVisible).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [menuData]);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleAddToCart = (item: MenuItem, quantity: number, note: string) => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: Number(item.price),
      imageUrl: item.imageUrl,
      isVeg: item.isVeg,
      quantity,
      note,
    });
  };

  const handleOrderPlaced = () => {
    // Open the drawer automatically when an order is placed
    setIsOrdersOpen(true);
    router.refresh();
  };

  const handleBillSettled = useCallback(() => {
    // Clear session from localStorage and memory so the Orders FAB disappears
    endSession();
    setBillSettled(true);
    setIsOrdersOpen(true); // Keep drawer open to show the thank-you screen
  }, [endSession]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--canvas)" }}
      >
        <LoadingSpinner size="lg" label="Loading menu..." />
      </div>
    );
  }

  if (!menuData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--canvas)" }}
      >
        <p style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}>
          Failed to load menu
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-4" style={{ background: "var(--canvas)" }}>

      {/* ── Sticky header ── */}
      <div
        className="sticky top-0 z-40 border-b"
        style={{
          background: "var(--canvas)",
          borderColor: "var(--line)",
        }}
      >
        <header className="px-4 pt-4 pb-2">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1
                  className="font-display text-2xl"
                  style={{
                    fontFamily: "var(--font-fraunces)",
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {restaurant.name}
                </h1>
                {restaurant.tagline && (
                  <p
                    className="text-xs line-clamp-1"
                    style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
                  >
                    {restaurant.tagline}
                  </p>
                )}
              </div>

              {/* Table number badge */}
              <div className="flex-shrink-0 ml-4">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "var(--card)",
                    color: "var(--spice-deep)",
                    fontFamily: "var(--font-mono)",
                    border: "1px solid var(--line)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {formatTableName(table.tableNumber, table.label)}
                </span>
              </div>
            </div>

            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </header>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="px-4 pb-3 max-w-2xl mx-auto">
            <CategoryTabs
              categories={categories}
              activeCategory={selectedCategory}
              onCategoryChange={(id) =>
                setSelectedCategory((prev) => (prev === id ? null : id))
              }
            />
          </div>
        )}
      </div>

      {/* ── Menu Items ── */}
      <main className="max-w-2xl mx-auto px-4 pt-4">
        {selectedCategory === null && !searchQuery && (
          <div className="mb-2">
            <h2
              className="font-display text-lg"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              All Items
            </h2>
          </div>
        )}

        {selectedCategory && !searchQuery && categories.find((c) => c.id === selectedCategory) && (
          <div className="mb-2">
            <h2
              className="font-display text-lg"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              {categories.find((c) => c.id === selectedCategory)?.emoji}{" "}
              {categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
          </div>
        )}

        <MenuItemGrid items={filteredItems} onItemClick={handleItemClick} />

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
               className="text-sm">
              No items found
            </p>
          </div>
        )}
      </main>

      {/* ── Overlays & drawers (all logic preserved) ── */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
        isDemoMode={isDemoMode}
      />

      {!isDemoMode && (
        <>
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            tableId={tableId}
            sessionId={session?.id || ""}
            restaurantId={restaurant.id}
            onOrderPlaced={handleOrderPlaced}
          />

          <CartFab
            itemCount={totalItems}
            totalPrice={totalPrice}
            onClick={() => setIsCartOpen(true)}
          />

          <WaiterCallButton tableId={tableId} />

          {/* Show Orders FAB only when there is an active session and bill is not yet settled */}
          {session && !billSettled && <OrdersFab onClick={() => setIsOrdersOpen(true)} />}

          <OrdersDrawer
            isOpen={isOrdersOpen}
            onClose={() => setIsOrdersOpen(false)}
            sessionId={session?.id || ""}
            restaurantId={restaurant.id}
            tableId={tableId}
            onBillSettled={handleBillSettled}
          />
        </>
      )}
    </div>
  );
}
