"use client";

import { useState } from "react";

interface QRCodeDisplayProps {
  tableId: string;
  tableNumber: number;
  label?: string | null;
}

export function QRCodeDisplay({ tableId, tableNumber, label }: QRCodeDisplayProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const qrUrl = `/api/qr/${tableId}`;

  const handleDownload = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `table-${tableNumber}-qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      // Handle error
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-4 flex flex-col items-center">
      <p className="font-display font-semibold text-text mb-1">
        Table {tableNumber}
      </p>
      {label && <p className="text-xs text-text-muted mb-2">{label}</p>}
      
      <div className="w-40 h-40 bg-white rounded-xl border border-border p-2 mb-3">
        {!isLoaded && (
          <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt={`QR code for table ${tableNumber}`}
          className={`w-full h-full object-contain ${isLoaded ? "block" : "hidden"}`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      <button
        onClick={handleDownload}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-text hover:bg-bg transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download
      </button>
    </div>
  );
}
