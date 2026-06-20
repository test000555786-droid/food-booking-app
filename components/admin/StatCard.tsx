"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  delay?: number;
}

export function StatCard({ title, value, subtitle, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-surface rounded-2xl border border-border p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-text tabular-nums">{value}</p>
      <p className="text-sm font-medium text-text mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
    </motion.div>
  );
}
