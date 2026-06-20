"use client";

import { motion } from "framer-motion";

export function SoldOutOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10"
    >
      <span className="px-3 py-1.5 bg-text/80 text-white text-xs font-semibold rounded-full uppercase tracking-wider">
        Sold Out
      </span>
    </motion.div>
  );
}
