"use client";

import { useState } from "react";

interface TableFormProps {
  onSubmit: (data: { tableNumber: number; label: string }) => Promise<void>;
  onCancel: () => void;
}

export function TableForm({ onSubmit, onCancel }: TableFormProps) {
  const [tableNumber, setTableNumber] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(tableNumber);
    if (!num || num <= 0) {
      setError("Valid table number required");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ tableNumber: num, label: label.trim() });
      setTableNumber("");
      setLabel("");
    } catch {
      setError("Failed to create table");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="w-24">
        <label className="block text-xs text-text-muted mb-1">Number</label>
        <input
          type="number"
          value={tableNumber}
          onChange={(e) => { setTableNumber(e.target.value); setError(""); }}
          placeholder="1"
          min="1"
          className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs text-text-muted mb-1">Label (optional)</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Window Seat"
          className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium disabled:opacity-50"
      >
        Add
      </button>
      <button type="button" onClick={onCancel} className="px-3 py-2.5 border border-border rounded-xl text-sm text-text-muted hover:text-text">
        Cancel
      </button>
      {error && <p className="text-xs text-danger absolute -bottom-5 left-0">{error}</p>}
    </form>
  );
}
