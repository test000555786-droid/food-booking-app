"use client";

interface OrdersFabProps {
  onClick: () => void;
}

export function OrdersFab({ onClick }: OrdersFabProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 left-4 z-30 flex items-center gap-2 px-4 py-3 bg-white border border-border rounded-full shadow-md hover:bg-bg transition-colors text-text active:scale-95"
    >
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span className="text-sm font-medium">My Orders</span>
    </button>
  );
}
