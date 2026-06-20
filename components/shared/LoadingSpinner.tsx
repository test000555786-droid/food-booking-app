"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  inline?: boolean;
  label?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-3",
  lg: "w-12 h-12 border-4",
};

export function LoadingSpinner({ size = "md", inline = false, label }: LoadingSpinnerProps) {
  const spinner = (
    <motion.div
      className={`${sizeMap[size]} rounded-full border-primary border-t-transparent`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  );

  if (inline) {
    return (
      <div className="flex items-center gap-3">
        {spinner}
        {label && <span className="text-sm text-text-muted">{label}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      {spinner}
      {label && <span className="text-sm text-text-muted">{label}</span>}
    </div>
  );
}
