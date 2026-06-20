"use client";

import { useState, useEffect } from "react";
import { Category, MenuItem } from "@/types";
import { ImageUpload } from "../shared/ImageUpload";
import { LoadingSpinner } from "../shared/LoadingSpinner";

interface MenuItemFormProps {
  categories: Category[];
  initialData?: MenuItem | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  isVeg: boolean;
  isAvailable: boolean;
  isBestseller: boolean;
  isSpicy: boolean;
  imageUrl: string;
}

export function MenuItemForm({ categories, initialData, onSubmit, onCancel }: MenuItemFormProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    categoryId: categories[0]?.id || "",
    isVeg: true,
    isAvailable: true,
    isBestseller: false,
    isSpicy: false,
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description || "",
        price: initialData.price.toString(),
        categoryId: initialData.categoryId,
        isVeg: initialData.isVeg,
        isAvailable: initialData.isAvailable,
        isBestseller: initialData.isBestseller,
        isSpicy: initialData.isSpicy,
        imageUrl: initialData.imageUrl || "",
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!form.categoryId) newErrors.categoryId = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ImageUpload
        value={form.imageUrl}
        onChange={(url) => updateField("imageUrl", url)}
      />

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="e.g., Butter Chicken"
          className={`w-full px-3 py-2.5 rounded-xl border ${errors.name ? "border-danger" : "border-border"} text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`}
        />
        {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Brief description of the dish"
          rows={2}
          className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Price (₹) *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="299"
            min="0"
            step="1"
            className={`w-full px-3 py-2.5 rounded-xl border ${errors.price ? "border-danger" : "border-border"} text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20`}
          />
          {errors.price && <p className="text-xs text-danger mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Category *</label>
          <select
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            className={`w-full px-3 py-2.5 rounded-xl border ${errors.categoryId ? "border-danger" : "border-border"} text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white`}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isVeg}
            onChange={(e) => updateField("isVeg", e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-text">Vegetarian</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isAvailable}
            onChange={(e) => updateField("isAvailable", e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-text">Available</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isBestseller}
            onChange={(e) => updateField("isBestseller", e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-text">Bestseller</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isSpicy}
            onChange={(e) => updateField("isSpicy", e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-text">Spicy</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-border text-text font-medium text-sm hover:bg-bg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors disabled:opacity-50"
        >
          {isSubmitting ? <LoadingSpinner size="sm" inline /> : initialData ? "Update Item" : "Add Item"}
        </button>
      </div>
    </form>
  );
}
