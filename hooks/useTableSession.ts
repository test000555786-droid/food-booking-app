"use client";

import { useState, useEffect, useCallback } from "react";
import { TableSession } from "@/types";

interface UseTableSessionReturn {
  session: TableSession | null;
  isLoading: boolean;
  error: string | null;
  startSession: (tableId: string) => Promise<TableSession>;
  endSession: () => Promise<void>;
}

const SESSION_STORAGE_KEY = "tablescan-session";

export function useTableSession(tableId: string): UseTableSessionReturn {
  const [session, setSession] = useState<TableSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load existing session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TableSession;
        // Only use if it matches current table
        if (parsed.tableId === tableId && !parsed.endedAt) {
          setSession(parsed);
        }
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, [tableId]);

  const startSession = useCallback(
    async (tid: string): Promise<TableSession> => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/tables/${tid}/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to start session");
        }

        const newSession = (await res.json()) as TableSession;
        setSession(newSession);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
        return newSession;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to start session";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const endSession = useCallback(async () => {
    if (!session) return;

    try {
      await fetch(`/api/tables/${tableId}/session`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      });
    } catch {
      // Ignore errors on end
    } finally {
      setSession(null);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [session, tableId]);

  return {
    session,
    isLoading,
    error,
    startSession,
    endSession,
  };
}
