"use client";

import { useRef } from "react";
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
      className="flex gap-0 overflow-x-auto scrollbar-hide py-1 snap-x justify-start"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        const normalizedName = category.name.toLowerCase().replace(/\s+/g, '_');
        const validImages = ['starters', 'main_course', 'breads', 'desserts', 'beverages'];
        const imageUrl = validImages.includes(normalizedName) ? `/categories/${normalizedName}.png` : null;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`snap-center relative flex-shrink-0 flex items-center mr-1 text-sm transition-all ${imageUrl ? 'gap-2 pr-4 pl-1.5 py-1.5' : 'gap-1.5 px-4 py-2'}`}
            style={{
              background: isActive ? "var(--spice)" : "transparent",
              color: isActive ? "var(--canvas)" : "var(--ink-muted)",
              borderRadius: "9999px",
              fontFamily: "var(--font-work-sans)",
              fontWeight: isActive ? 500 : 400,
              borderBottom: isActive ? "none" : "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderBottom = "1px solid var(--line)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderBottom = "1px solid transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-muted)";
              }
            }}
          >
            {imageUrl ? (
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0" style={{ border: isActive ? "1px solid rgba(255,255,255,0.2)" : "1px solid var(--line)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={category.name} className="w-full h-full object-cover" />
              </div>
            ) : category.emoji ? (
              <span className="text-base leading-none pl-1">{category.emoji}</span>
            ) : null}
            <span className="whitespace-nowrap">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
