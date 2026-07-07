"use client";

import { formatPrice } from "@/lib/formatters";

interface MenuLineProps {
  /** Item name — rendered in Fraunces */
  name: string;
  /** Price in paise/rupees — rendered in JetBrains Mono via formatPrice */
  price: number;
  /** Optional small tag badge (e.g. "Chef's Pick") */
  tag?: string;
  /** Optional italic caption below the dot-leader row */
  caption?: string;
  /** Extra class names for the outer wrapper */
  className?: string;
}

/**
 * MenuLine — the signature dot-leader row.
 *
 * Layout:
 *   [name in Fraunces] ---dotted flex-fill--- [price in JetBrains Mono]
 *
 * The dotted leader is a flex-grow div with border-bottom dotted var(--line),
 * shifted up a few px so it never touches descenders.
 */
export function MenuLine({ name, price, tag, caption, className = "" }: MenuLineProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Dot-leader row */}
      <div className="flex items-baseline w-full gap-0">
        {/* Name */}
        <span
          className="font-display font-500 text-ink whitespace-nowrap pr-1 leading-snug"
          style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500 }}
        >
          {name}
        </span>

        {/* Tag badge — inline after name */}
        {tag && (
          <span
            className="ml-2 mr-1 flex-shrink-0 px-1.5 py-0 text-[10px] font-medium rounded-sm whitespace-nowrap"
            style={{
              background: "var(--card)",
              color: "var(--spice-deep)",
              fontFamily: "var(--font-work-sans)",
              lineHeight: "1.6",
            }}
          >
            {tag}
          </span>
        )}

        {/* Dotted leader */}
        <span className="dot-leader" aria-hidden="true" />

        {/* Price */}
        <span
          className="font-mono text-ink whitespace-nowrap pl-1 leading-snug"
          style={{ fontFamily: "var(--font-mono)", fontWeight: 400 }}
        >
          {formatPrice(price)}
        </span>
      </div>

      {/* Optional caption */}
      {caption && (
        <p
          className="mt-0.5 text-xs italic leading-relaxed"
          style={{ color: "var(--ink-muted)", fontFamily: "var(--font-work-sans)" }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
