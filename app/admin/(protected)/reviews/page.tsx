"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionUser, Review } from "@/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ReviewCard } from "@/components/admin/ReviewCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";

export default function AdminReviewsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "visible">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          loadReviews(data.user.restaurantId);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const loadReviews = async (restaurantId: string) => {
    try {
      const res = await fetch(`/api/reviews?restaurantId=${restaurantId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch {
      // Handle error
    }
  };

  const handleToggle = async (reviewId: string, isVisible: boolean) => {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible }),
    });
    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isVisible } : r))
      );
      toast.success(isVisible ? "Review approved!" : "Review hidden");
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return !r.isVisible;
    if (filter === "visible") return r.isVisible;
    return true;
  });

  if (isLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) { router.push("/admin"); return null; }

  return (
    <div>
      <Toaster position="top-center" />
      <AdminHeader user={user} onMenuClick={() => {}} title="Review Moderation" />
      <main className="p-4 max-w-lg">
        <div className="flex gap-2 mb-4">
          {(["all", "pending", "visible"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-primary text-white" : "bg-surface border border-border text-text-muted hover:text-text"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onToggleVisibility={handleToggle} />
          ))}
          {filteredReviews.length === 0 && (
            <p className="text-center text-text-muted text-sm py-8">No reviews found</p>
          )}
        </div>
      </main>
    </div>
  );
}
