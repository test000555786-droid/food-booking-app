"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
}

const sizeMap = {
  sm: { icon: "w-6 h-6", text: "text-lg" },
  md: { icon: "w-8 h-8", text: "text-xl" },
  lg: { icon: "w-10 h-10", text: "text-2xl" },
};

export function Logo({ size = "md", showTagline = false, href = "/" }: LogoProps) {
  const { icon, text } = sizeMap[size];

  const content = (
    <div className="flex items-center gap-2">
      <div className={`${icon} rounded-lg bg-primary flex items-center justify-center`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-3/5 h-3/5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 7h16M4 17h16M8 7v10M16 7v10" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`font-display font-bold text-text ${text} leading-tight`}>
          TableScan
        </span>
        {showTagline && (
          <span className="text-[10px] text-text-muted leading-none">QR Ordering</span>
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
