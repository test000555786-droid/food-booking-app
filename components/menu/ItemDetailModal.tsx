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
            className="w-full max-w-lg rounded-t-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: "var(--canvas)" }}
          >
            {/* Image */}
            <div
              className="relative h-52"
              style={{ background: "var(--card)" }}
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                       style={{ color: "var(--line)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(251,246,237,0.92)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: "var(--ink)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                <VegBadge isVeg={item.isVeg} size="md" />
                {item.isBestseller && <BestsellerBadge />}
                {item.isSpicy && (
                  <span className="text-sm">🌶️ Spicy</span>
                )}
              </div>

              {/* Name */}
              <h2
                className="font-display text-2xl mb-1"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontWeight: 600,
                  color: "var(--ink)",
                  lineHeight: 1.15,
                }}
              >
                {item.name}
              </h2>

              {/* Price */}
              <p
                className="font-mono text-xl mb-3"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--spice)",
                  fontWeight: 500,
                }}
              >
                {formatPrice(item.price)}
              </p>

              {/* Description */}
              {item.description && (
                <p
                  className="text-sm leading-relaxed mb-5"
                  style={{
                    color: "var(--ink-muted)",
                    fontFamily: "var(--font-work-sans)",
                  }}
                >
                  {item.description}
                </p>
              )}

              {/* Note Input */}
              <div className="mb-5">
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--ink)", fontFamily: "var(--font-work-sans)" }}
                >
                  Special Request <span style={{ color: "var(--ink-muted)" }}>(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="E.g., Less spicy, no onions…"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none transition-colors"
                  style={{
                    border: "1px solid var(--line)",
                    background: "var(--canvas)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-work-sans)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--spice)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--line)";
                  }}
                />
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4">
                {/* Qty stepper */}
                <div
                  className="flex items-center rounded-lg overflow-hidden"
                  style={{ border: "1px solid var(--line)" }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center transition-colors"
                    style={{ color: "var(--ink)" }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span
                    className="w-10 h-10 flex items-center justify-center text-sm font-medium"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center transition-colors"
                    style={{ color: "var(--ink)" }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAdd}
                  className="flex-1 h-10 rounded-xl font-medium text-sm transition-opacity"
                  style={{
                    background: "var(--spice)",
                    color: "var(--canvas)",
                    fontFamily: "var(--font-work-sans)",
                  }}
                >
                  Add to Cart · {formatPrice(Number(item.price) * quantity)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
