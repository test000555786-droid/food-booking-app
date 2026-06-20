"use client";

import { motion } from "framer-motion";
import { CartItem } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { VegBadge } from "./VegBadge";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onUpdateNote: (menuItemId: string, note: string) => void;
  onRemove: (menuItemId: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onUpdateNote, onRemove }: CartItemRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="py-3 border-b border-border last:border-0"
    >
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-lg bg-bg flex-shrink-0 overflow-hidden">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <VegBadge isVeg={item.isVeg} />
            <span className="font-display font-medium text-sm text-text truncate">
              {item.name}
            </span>
          </div>
          <p className="text-sm font-semibold text-text tabular-nums mb-1">
            {formatPrice(item.price * item.quantity)}
          </p>

          {item.note && (
            <p className="text-xs text-text-muted mb-1.5 italic">Note: {item.note}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => onUpdateQuantity(item.menuItemId, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center text-text hover:bg-bg"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-7 h-7 flex items-center justify-center text-xs font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.menuItemId, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-text hover:bg-bg"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => onRemove(item.menuItemId)}
              className="text-xs text-danger hover:text-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
