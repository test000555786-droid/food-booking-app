"use client";

import { useState, useEffect, useCallback } from "react";
import { WaiterCall } from "@/types";
import { getRestaurantChannel } from "@/lib/pusher-client";

interface UseWaiterCallsReturn {
  calls: WaiterCall[];
  isLoading: boolean;
  unresolvedCalls: WaiterCall[];
  refresh: () => Promise<void>;
  resolveCall: (callId: string) => Promise<void>;
}

export function useWaiterCalls(restaurantId: string): UseWaiterCallsReturn {
  const [calls, setCalls] = useState<WaiterCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCalls = useCallback(async () => {
    try {
      const res = await fetch("/api/waiter-calls");
      if (!res.ok) throw new Error("Failed to fetch calls");
      const data = await res.json();
      setCalls(data.calls || []);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  // Pusher subscription
  useEffect(() => {
    if (!restaurantId) return;

    const channel = getRestaurantChannel(restaurantId);

    channel.bind("waiter-call", (call: WaiterCall) => {
      setCalls((prev) => {
        if (prev.find((c) => c.id === call.id)) return prev;
        return [call, ...prev];
      });
    });

    channel.bind("bill-request", (call: WaiterCall) => {
      setCalls((prev) => {
        if (prev.find((c) => c.id === call.id)) return prev;
        return [call, ...prev];
      });
    });

    channel.bind("call-resolved", (data: { callId: string }) => {
      setCalls((prev) =>
        prev.map((c) =>
          c.id === data.callId ? { ...c, isResolved: true, resolvedAt: new Date() } : c
        )
      );
    });

    return () => {
      channel.unbind("waiter-call");
      channel.unbind("bill-request");
      channel.unbind("call-resolved");
      // Do NOT call unsubscribeFromChannel here — the channel is shared
      // with useOrders and the dashboard page. Each hook manages its bindings only.
    };
  }, [restaurantId]);

  const resolveCall = async (callId: string): Promise<void> => {
    // Optimistically update state immediately so the banner disappears
    setCalls((prev) =>
      prev.map((c) =>
        c.id === callId ? { ...c, isResolved: true, resolvedAt: new Date() } : c
      )
    );

    try {
      const res = await fetch(`/api/waiter-calls/${callId}/resolve`, {
        method: "PATCH",
      });

      if (!res.ok) {
        // Rollback optimistic update on failure
        setCalls((prev) =>
          prev.map((c) =>
            c.id === callId ? { ...c, isResolved: false, resolvedAt: undefined } : c
          )
        );
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to resolve call");
      }
    } catch (err) {
      // Rollback optimistic update if fetch itself threw
      setCalls((prev) =>
        prev.map((c) =>
          c.id === callId ? { ...c, isResolved: false, resolvedAt: undefined } : c
        )
      );
      throw err;
    }
  };

  const unresolvedCalls = calls.filter((c) => !c.isResolved);

  return {
    calls,
    isLoading,
    unresolvedCalls,
    refresh: fetchCalls,
    resolveCall,
  };
}
