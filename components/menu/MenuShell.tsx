"use client";

import { useState, useMemo, useEffect } from "react";
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
}

export function MenuShell({ tableId, restaurant, table }: MenuShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: menuData, isLoading } = useMenu(restaurant.id);
  const { items, totalItems, totalPrice, addToCart } = useCart();
  const { session, isLoading: isSessionLoading, startSession } = useTableSession(tableId);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Hydrate cart on mount
  useEffect(() => {
    hydrateCart();
  }, []);

  // Start session if not exists
  useEffect(() => {
    if (!session && !isSessionLoading) {
      startSession(tableId).catch(() => {
        // Session may already exist
      });
    }
  }, [session, isSessionLoading, tableId, startSession]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading menu..." />
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted">Failed to load menu</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-4">
      {/* Unified Sticky Header */}
      <div className="sticky top-0 z-40 bg-bg/85 backdrop-blur-xl border-b border-border shadow-sm">
        <header className="px-4 pt-4 pb-2">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="font-display text-2xl font-bold text-text">{restaurant.name}</h1>
                {restaurant.tagline && (
                  <p className="text-xs text-text-muted line-clamp-1">{restaurant.tagline}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <span className="inline-flex items-center px-3 py-1 bg-orange-50 text-primary text-xs font-bold rounded-full border border-orange-100 shadow-sm">
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
              onCategoryChange={(id) => setSelectedCategory(prev => prev === id ? null : id)}
            />
          </div>
        )}
      </div>

      {/* Menu Items */}
      <main className="max-w-2xl mx-auto px-4 pt-6">
        {selectedCategory === null && !searchQuery && (
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold text-text mb-3">
              {searchQuery ? "Search Results" : "All Items"}
            </h2>
          </div>
        )}

        {selectedCategory && !searchQuery && categories.find((c) => c.id === selectedCategory) && (
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold text-text mb-3">
              {categories.find((c) => c.id === selectedCategory)?.emoji}{" "}
              {categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
          </div>
        )}

        <MenuItemGrid items={filteredItems} onItemClick={handleItemClick} />

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted text-sm">No items found</p>
          </div>
        )}
      </main>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        tableId={tableId}
        sessionId={session?.id || ""}
        restaurantId={restaurant.id}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Floating Cart Button */}
      <CartFab
        itemCount={totalItems}
        totalPrice={totalPrice}
        onClick={() => setIsCartOpen(true)}
      />

      {/* Call Waiter Button */}
      <WaiterCallButton tableId={tableId} />

      {/* View Orders / Bill Button (shown if session exists) */}
      {session && <OrdersFab onClick={() => setIsOrdersOpen(true)} />}

      {/* Orders & Bill Drawer */}
      <OrdersDrawer
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        sessionId={session?.id || ""}
        restaurantId={restaurant.id}
        tableId={tableId}
      />
    </div>
  );
}
