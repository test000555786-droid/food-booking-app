"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/formatters";
import { CartItemRow } from "./CartItemRow";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import toast from "react-hot-toast";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  sessionId: string;
  restaurantId: string;
  onOrderPlaced: () => void;
}

export function CartDrawer({ isOpen, onClose, tableId, sessionId, restaurantId, onOrderPlaced }: CartDrawerProps) {
  const { items, updateQuantity, updateNote, removeFromCart, totalItems, totalPrice, clearCart } = useCart();
  const [isPlacing, setIsPlacing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsPlacing(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          tableId,
          sessionId,
          items: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            note: item.note || undefined,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      const data = await res.json();
      clearCart();
      onClose();
      onOrderPlaced();
      toast.success(`Order ${data.orderNumber} placed!`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowConfirm(false);
    toast.success("Cart cleared");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h2 className="font-display text-lg font-semibold text-text">Your Cart</h2>
                  <p className="text-xs text-text-muted">{totalItems} item(s)</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-bg flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-4">
                <AnimatePresence>
                  {items.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-text-muted text-sm">Your cart is empty</p>
                      <button
                        onClick={onClose}
                        className="mt-3 text-primary text-sm font-medium"
                      >
                        Browse Menu
                      </button>
                    </div>
                  ) : (
                    items.map((item) => (
                      <CartItemRow
                        key={item.menuItemId}
                        item={item}
                        onUpdateQuantity={updateQuantity}
                        onUpdateNote={updateNote}
                        onRemove={removeFromCart}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-border p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-semibold text-text tabular-nums">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Taxes</span>
                    <span className="text-success text-xs">Included</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-semibold text-text">Total</span>
                    <span className="font-bold text-lg text-text tabular-nums">{formatPrice(totalPrice)}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlacing ? "Placing Order..." : `Place Order · ${formatPrice(totalPrice)}`}
                  </button>

                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full py-2 text-sm text-text-muted hover:text-danger transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart?"
        onConfirm={handleClearCart}
        onCancel={() => setShowConfirm(false)}
        confirmText="Clear"
        variant="danger"
      />
    </>
  );
}
