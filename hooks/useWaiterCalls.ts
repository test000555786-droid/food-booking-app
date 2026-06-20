"use client";

import { useState, useEffect, useCallback } from "react";
import { WaiterCall } from "@/types";
import { getRestaurantChannel, unsubscribeFromChannel } from "@/lib/pusher-client";

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
      unsubscribeFromChannel(restaurantId);
    };
  }, [restaurantId]);

  const resolveCall = async (callId: string) => {
    try {
      const res = await fetch(`/api/waiter-calls/${callId}/resolve`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Failed to resolve call");

      setCalls((prev) =>
        prev.map((c) =>
          c.id === callId ? { ...c, isResolved: true, resolvedAt: new Date() } : c
        )
      );
    } catch {
      throw new Error("Failed to resolve call");
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
