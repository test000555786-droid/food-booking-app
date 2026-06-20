"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface WaiterCallButtonProps {
  tableId: string;
  variant?: "floating" | "inline";
}

export function WaiterCallButton({ tableId, variant = "floating" }: WaiterCallButtonProps) {
  const [isCalling, setIsCalling] = useState(false);

  const handleCall = async () => {
    if (isCalling) return;
    setIsCalling(true);

    try {
      const res = await fetch("/api/waiter-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId, type: "WAITER" }),
      });

      if (!res.ok) throw new Error("Failed to call waiter");

      toast.success("Waiter has been called!");
    } catch {
      toast.error("Failed to call waiter. Please try again.");
    } finally {
      setIsCalling(false);
    }
  };

  if (variant === "inline") {
    return (
      <button
        onClick={handleCall}
        disabled={isCalling}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text hover:bg-bg transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {isCalling ? "Calling..." : "Call Waiter"}
      </button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleCall}
      disabled={isCalling}
      className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-white border border-border rounded-full shadow-md flex items-center justify-center hover:bg-bg transition-colors"
      title="Call Waiter"
    >
      <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </motion.button>
  );
}
