"use client";

import { motion } from "framer-motion";
import { CartItem } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { VegBadge } from "./VegBadge";
import { MenuLine } from "@/components/shared/MenuLine";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onUpdateNote: (menuItemId: string, note: string) => void;
  onRemove: (menuItemId: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onUpdateNote: _onUpdateNote, onRemove }: CartItemRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="py-4"
      style={{ borderBottom: "1px solid var(--line)" }}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div
          className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-lg"
          style={{ background: "var(--card)" }}
        >
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: "var(--line)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Veg indicator + dot-leader row */}
          <div className="flex items-center gap-1.5 mb-1">
            <VegBadge isVeg={item.isVeg} />
          </div>

          {/* Dot-leader: name ··· line total */}
          <MenuLine
            name={item.name}
            price={item.price * item.quantity}
          />

          {/* Unit price note */}
          {item.quantity > 1 && (
            <p
              className="text-xs mt-0.5 font-mono"
              style={{ color: "var(--ink-muted)", fontFamily: "var(--font-mono)" }}
            >
              {formatPrice(item.price)} × {item.quantity}
            </p>
          )}

          {/* Special request note */}
          {item.note && (
            <p
              className="text-xs italic mt-1"
              style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
            >
              Note: {item.note}
            </p>
          )}

          {/* Qty stepper + remove */}
          <div className="flex items-center justify-between mt-2">
            <div
              className="flex items-center rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--line)" }}
            >
              <button
                onClick={() => onUpdateQuantity(item.menuItemId, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center transition-colors"
                style={{ color: "var(--ink)" }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                </svg>
              </button>
              <span
                className="w-7 h-7 flex items-center justify-center text-xs font-medium"
                style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.menuItemId, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center transition-colors"
                style={{ color: "var(--ink)" }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => onRemove(item.menuItemId)}
              className="text-xs transition-colors"
              style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
