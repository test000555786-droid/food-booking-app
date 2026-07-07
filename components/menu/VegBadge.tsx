"use client";

interface VegBadgeProps {
  isVeg: boolean;
  size?: "sm" | "md";
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
};

/**
 * Classic FSSAI-style veg/non-veg indicator.
 * Veg → sage green dot inside sage border.
 * Non-veg → spice-deep dot inside spice-deep border.
 */
export function VegBadge({ isVeg, size = "sm" }: VegBadgeProps) {
  const color = isVeg ? "var(--sage)" : "var(--spice-deep)";

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 ${sizeMap[size]} rounded-sm`}
      style={{ border: `1.5px solid ${color}` }}
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
    >
      <svg viewBox="0 0 8 8" className="w-2 h-2" style={{ fill: color }}>
        <circle cx="4" cy="4" r="2.5" />
      </svg>
    </span>
  );
}
