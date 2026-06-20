"use client";

interface VegBadgeProps {
  isVeg: boolean;
  size?: "sm" | "md";
}

const sizeMap = {
  sm: "w-3.5 h-3.5 text-[6px]",
  md: "w-4.5 h-4.5 text-[7px]",
};

export function VegBadge({ isVeg, size = "sm" }: VegBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${sizeMap[size]} border rounded ${
        isVeg
          ? "border-success text-success"
          : "border-danger text-danger"
      }`}
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
    >
      <svg viewBox="0 0 8 8" className="w-2 h-2 fill-current">
        <circle cx="4" cy="4" r="3" />
      </svg>
    </span>
  );
}
