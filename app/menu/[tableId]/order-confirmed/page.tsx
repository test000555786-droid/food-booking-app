"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { OrderStatusTracker } from "@/components/menu/OrderStatusTracker";
import { Logo } from "@/components/shared/Logo";

interface OrderConfirmedPageProps {
  params: { tableId: string };
}

export default function OrderConfirmedPage({ params }: OrderConfirmedPageProps) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const restaurantId = searchParams.get("restaurantId");

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto">
          <Logo size="sm" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-text mb-2">
            Order Confirmed!
          </h1>
          <p className="text-sm text-text-muted">
            Your order has been placed successfully. Track its status below.
          </p>
        </div>

        {/* Order Status Tracker */}
        {orderId && restaurantId ? (
          <OrderStatusTracker
            initialOrders={[]}
            restaurantId={restaurantId}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-text-muted">
              Unable to load order details. Please check with the staff.
            </p>
          </div>
        )}

        {/* Back to Menu */}
        <div className="mt-8 text-center">
          <Link
            href={`/menu/${params.tableId}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Menu
          </Link>
        </div>
      </main>
    </div>
  );
}
