"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Category } from "@/types";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1 snap-x justify-start"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`snap-center relative flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
              isActive
                ? "bg-primary text-white border-transparent"
                : "bg-white border border-border text-text hover:border-primary/30"
            }`}
          >
            {category.emoji && <span className="text-lg leading-none">{category.emoji}</span>}
            <span className="whitespace-nowrap">{category.name}</span>
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary rounded-full -z-10"
                transition={{ type: "spring", duration: 0.4 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
