"use client";

import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search menu..." }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className="relative flex items-center rounded-lg transition-all"
      style={{
        background: isFocused ? "var(--canvas)" : "var(--card)",
        border: isFocused ? "1px solid var(--spice)" : "1px solid var(--line)",
        outline: isFocused ? "3px solid rgba(193,68,14,0.12)" : "none",
      }}
    >
      <svg
        className="absolute left-3 w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ color: "var(--ink-muted)" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2.5 bg-transparent text-sm outline-none"
        style={{
          color: "var(--ink)",
          fontFamily: "var(--font-work-sans)",
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 w-5 h-5 flex items-center justify-center"
          style={{ color: "var(--ink-muted)" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
