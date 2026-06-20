"use client";

import { Category } from "@/types";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { useState } from "react";

interface CategoryListProps {
  categories: Category[];
  onUpdate: (id: string, data: Partial<Category>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function CategoryList({ categories, onUpdate, onDelete }: CategoryListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {categories.map((cat) => (
        <div key={cat.id} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border">
          <span className="text-lg">{cat.emoji}</span>
          <span className="flex-1 font-medium text-sm text-text">{cat.name}</span>
          
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-text-muted">
            <input
              type="checkbox"
              checked={cat.isVisible}
              onChange={(e) => onUpdate(cat.id, { isVisible: e.target.checked })}
              className="w-3.5 h-3.5 rounded border-border text-primary"
            />
            Visible
          </label>

          <button
            onClick={() => setDeleteId(cat.id)}
            className="p-1.5 text-text-muted hover:text-danger rounded-lg hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Category"
        message="Are you sure? Items in this category will become uncategorized."
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
        variant="danger"
      />
    </div>
  );
}
