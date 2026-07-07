"use client";

import { motion } from "framer-motion";
import { MenuItem } from "@/types";
import { VegBadge } from "./VegBadge";
import { BestsellerBadge } from "./BestsellerBadge";
import { SoldOutOverlay } from "./SoldOutOverlay";
import { MenuLine } from "@/components/shared/MenuLine";

interface MenuItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  index?: number;
}

export function MenuItemCard({ item, onClick, index = 0 }: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={() => item.isAvailable && onClick(item)}
      className={`relative flex items-start gap-3 py-4 ${
        item.isAvailable ? "cursor-pointer" : "opacity-60"
      }`}
      style={{ borderBottom: "1px solid var(--line)" }}
    >
      {!item.isAvailable && <SoldOutOverlay />}

      {/* Small square image — left (only if imageUrl exists) */}
      {item.imageUrl && (
        <div
          className="flex-shrink-0 w-16 h-16 overflow-hidden"
          style={{ borderRadius: "8px", background: "var(--card)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <VegBadge isVeg={item.isVeg} />
          {item.isBestseller && <BestsellerBadge />}
          {item.isSpicy && (
            <span className="text-xs" title="Spicy">🌶️</span>
          )}
        </div>

        {/* Dot-leader row: name ··· price */}
        <MenuLine
          name={item.name}
          price={Number(item.price)}
        />

        {/* Description */}
        {item.description && (
          <p
            className="text-xs mt-1 line-clamp-2 leading-relaxed"
            style={{
              color: "var(--ink-muted)",
              fontFamily: "var(--font-work-sans)",
            }}
          >
            {item.description}
          </p>
        )}
      </div>

      {/* Circular + add button — right edge, triggers onClick (opens modal) */}
      {item.isAvailable && (
        <div className="flex-shrink-0 self-start mt-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(item);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-full transition-opacity active:opacity-70"
            style={{
              background: "var(--spice)",
              color: "var(--canvas)",
            }}
            aria-label={`Add ${item.name} to cart`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
}
