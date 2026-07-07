"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/formatters";

interface CartFabProps {
  itemCount: number;
  totalPrice: number;
  onClick: () => void;
}

export function CartFab({ itemCount, totalPrice, onClick }: CartFabProps) {
  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ background: "var(--canvas)" }}
          >
            {/* Left — item count + label */}
            <div className="flex items-center gap-2">
              <span
                className="text-sm"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-muted)",
                }}
              >
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
              <span style={{ color: "var(--line)" }}>·</span>
              <span
                className="text-sm font-medium"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink)",
                }}
              >
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Right — CTA */}
            <button
              onClick={onClick}
              className="px-5 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                background: "var(--spice)",
                color: "var(--canvas)",
                fontFamily: "var(--font-work-sans)",
              }}
            >
              View cart
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
