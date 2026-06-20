"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface BillRequestButtonProps {
  tableId: string;
}

export function BillRequestButton({ tableId }: BillRequestButtonProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestBill = async () => {
    if (isRequesting) return;
    setIsRequesting(true);

    try {
      const res = await fetch("/api/waiter-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId, type: "BILL" }),
      });

      if (!res.ok) throw new Error("Failed to request bill");

      toast.success("Bill request sent!");
    } catch {
      toast.error("Failed to request bill. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleRequestBill}
      disabled={isRequesting}
      className="fixed bottom-20 left-4 z-30 flex items-center gap-2 px-4 py-3 bg-white border border-border rounded-full shadow-md hover:bg-bg transition-colors"
    >
      <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <span className="text-sm font-medium text-text">
        {isRequesting ? "Requesting..." : "Request Bill"}
      </span>
    </motion.button>
  );
}
