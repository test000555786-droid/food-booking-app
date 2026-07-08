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
  restaurantId: string;
  tableId: string;
  isDemoMode?: boolean;
}

export function HomeMenuPreview({ categories, popularItems, restaurantId, tableId, isDemoMode = false }: HomeMenuPreviewProps) {
  const { totalItems, totalPrice, addToCart } = useCart();
  const { session, isLoading: isSessionLoading, startSession, endSession } = useTableSession(tableId);

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [billSettled, setBillSettled] = useState(false);
  const router = useRouter();

  // Hydrate cart on mount
  useEffect(() => {
    hydrateCart();
  }, []);

  // Ensure session exists if they try to use cart (skip in demo mode)
  useEffect(() => {
    if (!isDemoMode && totalItems > 0 && !session && !isSessionLoading) {
      startSession(tableId).catch(() => {});
    }
  }, [isDemoMode, totalItems, session, isSessionLoading, tableId, startSession]);

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

  const handleBillSettled = () => {
    endSession();
    setBillSettled(true);
    setIsOrdersOpen(true);
  };

  return (
    <>
      {/* ── Category pills ── */}
      {categories.length > 0 && (
        <section
          className="py-8 border-y overflow-hidden"
          style={{ borderColor: "var(--line)", background: "var(--canvas)" }}
        >
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x justify-start md:justify-center">
              {categories.map((category) => {
                const normalizedName = category.name.toLowerCase().replace(/\s+/g, '_');
                const validImages = ['starters', 'main_course', 'breads', 'desserts', 'beverages'];
                const imageUrl = validImages.includes(normalizedName) ? `/categories/${normalizedName}.png` : null;

                return (
                <Link
                  key={category.id}
                  href={`/menu/${tableId}?category=${category.id}`}
                  className="snap-center flex-shrink-0 flex items-center gap-2.5 pr-4 pl-1.5 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap"
                  style={{
                    border: "1px solid var(--line)",
                    color: "var(--ink-muted)",
                    background: "var(--canvas)",
                    fontFamily: "var(--font-work-sans)",
                    fontWeight: 400,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--spice)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--spice)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-muted)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--line)";
                  }}
                >
                  {imageUrl ? (
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0" style={{ border: "1px solid var(--line)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt={category.name} className="w-full h-full object-cover" />
                    </div>
                  ) : category.emoji ? (
                    <span className="text-base leading-none pl-2.5">{category.emoji}</span>
                  ) : null}
                  <span>{category.name}</span>
                </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Popular Dishes (uses the dot-leader MenuItemCard list) ── */}
      {popularItems.length > 0 && (
        <section
          className="border-b py-14"
          style={{ borderColor: "var(--line)", background: "var(--canvas)" }}
        >
          <div className="max-w-2xl mx-auto px-4">
            <p
              className="font-mono text-xs uppercase tracking-[0.18em] mb-2"
              style={{ color: "var(--gold)", fontFamily: "var(--font-mono)" }}
            >
              Most Loved
            </p>
            <h2
              className="font-display text-3xl mb-8"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.1,
              }}
            >
              Popular Dishes
            </h2>

            {/* Flat list — each MenuItemCard is now a dot-leader row */}
            <div className="flex flex-col">
              {popularItems.map((item, index) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onClick={handleItemClick}
                  index={index}
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
        isDemoMode={isDemoMode}
      />

      {!isDemoMode && (
        <>
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

          {/* View Orders / Bill Button (shown if session exists and bill not settled) */}
          {session && !billSettled && <OrdersFab onClick={() => setIsOrdersOpen(true)} />}

          {/* Orders & Bill Drawer */}
          <OrdersDrawer
            isOpen={isOrdersOpen}
            onClose={() => setIsOrdersOpen(false)}
            sessionId={session?.id || ""}
            restaurantId={restaurantId}
            tableId={tableId}
            onBillSettled={handleBillSettled}
          />
        </>
      )}
    </>
  );
}
