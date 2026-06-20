"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { VegBadge } from "./VegBadge";
import { BestsellerBadge } from "./BestsellerBadge";

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, note: string) => void;
}

export function ItemDetailModal({ item, isOpen, onClose, onAddToCart }: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  if (!item) return null;

  const handleAdd = () => {
    onAddToCart(item, quantity, note);
    setQuantity(1);
    setNote("");
    onClose();
  };

  const handleClose = () => {
    setQuantity(1);
    setNote("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-surface rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Image */}
            <div className="relative h-56 bg-bg">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-t-3xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
              >
                <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <VegBadge isVeg={item.isVeg} size="md" />
                {item.isBestseller && <BestsellerBadge />}
                {item.isSpicy && <span className="text-sm">🌶️ Spicy</span>}
              </div>

              <h2 className="font-display text-2xl font-bold text-text mb-1">
                {item.name}
              </h2>

              <p className="text-primary font-semibold text-xl mb-3">
                {formatPrice(item.price)}
              </p>

              {item.description && (
                <p className="text-sm text-text-muted leading-relaxed mb-5">
                  {item.description}
                </p>
              )}

              {/* Note Input */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-text mb-1.5">
                  Special Request (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="E.g., Less spicy, no onions..."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm text-text placeholder:text-text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-text hover:bg-bg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-text">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-text hover:bg-bg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 h-10 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-colors text-sm"
                >
                  Add to Cart · {formatPrice(item.price * quantity)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
