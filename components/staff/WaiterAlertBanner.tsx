"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WaiterCall, CallType } from "@/types";
import { formatTableName, formatRelativeTime } from "@/lib/formatters";

interface WaiterAlertBannerProps {
  calls: WaiterCall[];
  onResolve: (callId: string) => void;
}

export function WaiterAlertBanner({ calls, onResolve }: WaiterAlertBannerProps) {
  return (
    <AnimatePresence>
      {calls.map((call) => (
        <motion.div
          key={call.id}
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          className={`rounded-xl p-4 mb-2 ${
            call.type === CallType.BILL
              ? "bg-green-50 border border-green-200"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                call.type === CallType.BILL ? "bg-green-100" : "bg-blue-100"
              }`}>
                {call.type === CallType.BILL ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-text">
                  {call.type === CallType.BILL ? "Bill Request" : "Waiter Call"}
                </p>
                <p className="text-xs text-text-muted">
                  {call.table ? formatTableName(call.table.tableNumber, call.table.label) : `Table`}
                  {" · "}
                  {formatRelativeTime(call.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onResolve(call.id)}
              className="px-3 py-1.5 bg-white border border-border rounded-lg text-sm font-medium text-text hover:bg-bg transition-colors"
            >
              Resolve
            </button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
