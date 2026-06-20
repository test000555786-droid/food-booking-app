"use client";

import { Review } from "@/types";
import { formatDate } from "@/lib/formatters";

interface ReviewCardProps {
  review: Review;
  onToggleVisibility: (reviewId: string, isVisible: boolean) => void;
}

export function ReviewCard({ review, onToggleVisibility }: ReviewCardProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-xs text-text-muted">{formatDate(review.createdAt)}</span>
      </div>

      {review.comment && (
        <p className="text-sm text-text mb-3">{review.comment}</p>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          review.isVisible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}>
          {review.isVisible ? "Visible" : "Hidden"}
        </span>
        <button
          onClick={() => onToggleVisibility(review.id, !review.isVisible)}
          className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
        >
          {review.isVisible ? "Hide" : "Approve"}
        </button>
      </div>
    </div>
  );
}
