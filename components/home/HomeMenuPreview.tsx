"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MenuItem, Category } from "@/types";
import { useCart } from "@/hooks/useCart";
import { hydrateCart } from "@/store/cartStore";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { ItemDetailModal } from "@/components/menu/ItemDetailModal";
import { CartFab } from "@/components/menu/CartFab";
import { CartDrawer } from "@/components/menu/CartDrawer";
import { OrdersFab } from "@/components/menu/OrdersFab";
import { OrdersDrawer } from "@/components/menu/OrdersDrawer";
import { useTableSession } from "@/hooks/useTableSession";
import { useRouter } from "next/navigation";

interface HomeMenuPreviewProps {
  categories: Category[];
  popularItems: MenuItem[];
  restaurantId: string;
  tableId: string;
}

export function HomeMenuPreview({ categories, popularItems, restaurantId, tableId }: HomeMenuPreviewProps) {
  const { items, totalItems, totalPrice, addToCart } = useCart();
  const { session, isLoading: isSessionLoading, startSession } = useTableSession(tableId);
  
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const router = useRouter();

  // Hydrate cart on mount
  useEffect(() => {
    hydrateCart();
  }, []);

  // Ensure session exists if they try to use cart
  useEffect(() => {
    if (totalItems > 0 && !session && !isSessionLoading) {
      startSession(tableId).catch(() => {});
    }
  }, [totalItems, session, isSessionLoading, tableId, startSession]);

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
    setIsCartOpen(false);
    setIsOrdersOpen(true);
    router.refresh();
  };

  return (
    <>
      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-surface py-8 border-y border-border overflow-hidden">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x justify-start">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/menu/${tableId}?category=${category.id}`}
                  className="snap-center flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-white rounded-full border border-border hover:border-primary hover:text-primary transition-all shadow-sm font-semibold text-text text-sm"
                >
                  <span className="text-xl leading-none">{category.emoji}</span>
                  <span className="whitespace-nowrap">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Dishes */}
      {popularItems.length > 0 && (
        <section className="bg-surface border-b border-border py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-text text-center mb-10">Popular Dishes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onClick={handleItemClick}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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
        restaurantId={restaurantId}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Floating Cart Button */}
      <CartFab
        itemCount={totalItems}
        totalPrice={totalPrice}
        onClick={() => setIsCartOpen(true)}
      />

      {/* View Orders / Bill Button (shown if session exists) */}
      {session && <OrdersFab onClick={() => setIsOrdersOpen(true)} />}

      {/* Orders & Bill Drawer */}
      <OrdersDrawer
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        sessionId={session?.id || ""}
        restaurantId={restaurantId}
        tableId={tableId}
      />
    </>
  );
}
