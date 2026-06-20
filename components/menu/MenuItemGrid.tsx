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
        <p className="text-text-muted text-sm">No items found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
