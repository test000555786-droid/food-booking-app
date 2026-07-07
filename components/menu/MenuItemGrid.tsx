"use client";

import { MenuItem } from "@/types";
import { MenuItemCard } from "./MenuItemCard";

interface MenuItemGridProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export function MenuItemGrid({ items, onItemClick }: MenuItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm" style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}>
          No items found
        </p>
      </div>
    );
  }

  return (
    // Flat list — no grid, no gap cards. Border-bottom is on each MenuItemCard row.
    <div className="flex flex-col">
      {items.map((item, index) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onClick={onItemClick}
          index={index}
        />
      ))}
    </div>
  );
}
