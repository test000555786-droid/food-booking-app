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
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={onClick}
          className="fixed bottom-4 left-4 right-4 z-40 bg-primary hover:bg-primary-hover text-white py-3.5 px-5 rounded-2xl shadow-lg flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-medium text-sm">{itemCount} item(s)</span>
          </div>
          <span className="font-semibold tabular-nums">{formatPrice(totalPrice)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
