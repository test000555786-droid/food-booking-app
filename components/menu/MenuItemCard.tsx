"use client";

import { motion } from "framer-motion";
import { MenuItem } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { VegBadge } from "./VegBadge";
import { BestsellerBadge } from "./BestsellerBadge";
import { SoldOutOverlay } from "./SoldOutOverlay";

interface MenuItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  index?: number;
}

export function MenuItemCard({ item, onClick, index = 0 }: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => item.isAvailable && onClick(item)}
      className={`relative bg-white rounded-2xl p-4 shadow-sm transition-shadow ${
        item.isAvailable ? "hover:shadow-md cursor-pointer active:scale-[0.98]" : "opacity-75"
      }`}
    >
      {!item.isAvailable && <SoldOutOverlay />}

      <div className="flex justify-between gap-4">
        {/* Content - Left Side */}
        <div className="flex-1 min-w-0 flex flex-col pt-1">
          <div className="flex items-center gap-1.5 mb-1.5">
            <VegBadge isVeg={item.isVeg} />
            {item.isBestseller && <BestsellerBadge />}
            {item.isSpicy && (
              <span className="text-xs" title="Spicy">🌶️</span>
            )}
          </div>
          <h3 className="font-display font-bold text-text text-base leading-snug line-clamp-2">
            {item.name}
          </h3>
          <p className="text-base font-semibold text-text tabular-nums mt-1.5">
            {formatPrice(item.price)}
          </p>
          {item.description && (
            <p className="text-xs text-text-muted line-clamp-2 mt-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Image & Add Button - Right Side */}
        <div className="relative w-[130px] flex-shrink-0 flex flex-col items-center">
          <div className="w-full h-[130px] rounded-2xl bg-bg overflow-hidden shadow-sm">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Add Button */}
          {item.isAvailable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(item);
              }}
              className="absolute -bottom-3 bg-white text-primary font-bold text-sm px-8 py-2 rounded-xl shadow-md border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
