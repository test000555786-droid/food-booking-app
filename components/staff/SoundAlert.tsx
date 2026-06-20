"use client";

import { useEffect, useRef, useCallback } from "react";

interface SoundAlertProps {
  playTrigger: unknown;
}

export function SoundAlert({ playTrigger }: SoundAlertProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteracted = useRef(false);

  // Track user interaction for autoplay policy
  useEffect(() => {
    const handleInteraction = () => {
      hasInteracted.current = true;
    };
    window.addEventListener("click", handleInteraction, { once: true });
    return () => window.removeEventListener("click", handleInteraction);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/order-alert.mp3");
    audioRef.current.volume = 0.5;
  }, []);

  const playSound = useCallback(() => {
    if (audioRef.current && hasInteracted.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Autoplay blocked — ignore
      });
    }
  }, []);

  useEffect(() => {
    if (playTrigger) {
      playSound();
    }
  }, [playTrigger, playSound]);

  return null;
}
