"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
  /** Force light wordmark color for use on dark backgrounds */
  light?: boolean;
}

const sizeMap = {
  sm: { iconSize: 28, gap: "gap-2",    text: "text-sm",   sub: "text-[9px]",  stroke: 1   },
  md: { iconSize: 36, gap: "gap-2.5",  text: "text-lg",   sub: "text-[10px]", stroke: 1.2 },
  lg: { iconSize: 48, gap: "gap-3",    text: "text-2xl",  sub: "text-xs",     stroke: 1.5 },
};

/**
 * Spice Garden logo mark — an SVG emblem combining a stylised spice leaf / flame
 * inside a refined circular ring with a dot-pattern, plus the Fraunces wordmark.
 */
export function Logo({ size = "md", showTagline = false, href = "/", light = false }: LogoProps) {
  const { iconSize, gap, text, sub, stroke } = sizeMap[size];
  const r = iconSize / 2;

  const content = (
    <div className={`inline-flex items-center ${gap}`}>

      {/* ── SVG Emblem ── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-label="Spice Garden logo mark"
      >
        {/* Outer circle ring */}
        <circle cx="24" cy="24" r="22" stroke="var(--gold)" strokeWidth={stroke} />

        {/* Inner background disc */}
        <circle cx="24" cy="24" r="19" fill="var(--ink)" />

        {/* Decorative thin inner ring */}
        <circle cx="24" cy="24" r="16" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="2 3" />

        {/* Stylised "SG" monogram using Fraunces-inspired curves — rendered as SVG paths */}
        {/* Central flame / leaf motif */}
        <path
          d="M24 10 C24 10, 17 18, 17 24 C17 28.4 20.1 32 24 32 C27.9 32 31 28.4 31 24 C31 18, 24 10, 24 10 Z"
          fill="var(--gold)"
          opacity="0.9"
        />
        {/* Inner highlight on flame */}
        <path
          d="M24 15 C24 15, 20 21, 20 25 C20 27.8 21.8 30 24 30 C26.2 30 28 27.8 28 25 C28 21, 24 15, 24 15 Z"
          fill="var(--ink)"
        />
        {/* Small gold centre dot */}
        <circle cx="24" cy="26" r="2" fill="var(--gold)" />

        {/* Corner decorative dots (4-point) */}
        <circle cx="24" cy="6"  r="1" fill="var(--gold)" />
        <circle cx="24" cy="42" r="1" fill="var(--gold)" />
        <circle cx="6"  cy="24" r="1" fill="var(--gold)" />
        <circle cx="42" cy="24" r="1" fill="var(--gold)" />
      </svg>

      {/* ── Wordmark ── */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-display tracking-tight ${text}`}
          style={{
            fontFamily: "var(--font-fraunces)",
            fontWeight: 600,
            color: light ? "var(--canvas)" : "var(--ink)",
            letterSpacing: "-0.01em",
          }}
        >
          Spice Garden
        </span>

        {showTagline && (
          <span
            className={`${sub} uppercase tracking-[0.12em] mt-0.5`}
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--gold)",
              fontWeight: 400,
            }}
          >
            Fine Indian Cuisine
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
