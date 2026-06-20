import { useState } from "react";

interface CategoryFormProps {
  onSubmit: (data: { name: string; emoji: string }) => void;
  onCancel: () => void;
  initialData?: { name: string; emoji: string };
}

export function CategoryForm({ onSubmit, onCancel, initialData }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [emoji, setEmoji] = useState(initialData?.emoji || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), emoji: emoji.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Starters"
          required
          className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1.5">Emoji Icon (optional)</label>
        <input
          type="text"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="e.g., 🥟"
          maxLength={5}
          className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 bg-bg text-text-muted font-medium rounded-xl hover:text-text transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          {initialData ? "Save Changes" : "Create"}
        </button>
      </div>
    </form>
  );
}
